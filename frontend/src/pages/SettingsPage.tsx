import React, { useEffect, useState } from 'react';
import { ldapService } from '../services';
import type { LdapConfig, LdapGroupMapping } from '../types';

const roleOptions = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'TECHNICIAN', label: 'Technik' },
  { value: 'USER', label: 'Użytkownik' },
  { value: 'OBSERVER', label: 'Obserwator' },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('ldap');
  const [config, setConfig] = useState<LdapConfig | null>(null);
  const [mappings, setMappings] = useState<LdapGroupMapping[]>([]);
  const [testResult, setTestResult] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ldapService.getConfig().then(r => setConfig(r.data)).catch(() => {});
    ldapService.getGroupMappings().then(r => setMappings(r.data)).catch(() => {});
  }, []);

  const handleSaveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const r = await ldapService.saveConfig(config);
      setConfig(r.data);
      alert('Konfiguracja zapisana pomyślnie');
    } catch {
      alert('Błąd podczas zapisywania konfiguracji');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      const r = await ldapService.testConnection();
      setTestResult(r.data.message);
    } catch {
      setTestResult('Błąd połączenia z serwerem LDAP');
    }
  };

  const settingsTabs = [
    { key: 'general', label: 'Organizacja', icon: 'fa-building' },
    { key: 'ldap', label: 'LDAP / Active Directory', icon: 'fa-sitemap' },
    { key: 'email', label: 'Email / SMTP', icon: 'fa-envelope' },
    { key: 'notifications', label: 'Powiadomienia', icon: 'fa-bell' },
    { key: 'sla', label: 'SLA', icon: 'fa-clock' },
    { key: 'categories', label: 'Kategorie', icon: 'fa-folder' },
    { key: 'appearance', label: 'Wygląd', icon: 'fa-palette' },
  ];

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <h2>Ustawienia</h2>
          <p>Konfiguracja systemu TicketFlow</p>
        </div>
      </div>

      <div className="settings-layout">
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-body" style={{ padding: 8 }}>
            {settingsTabs.map(t => (
              <div key={t.key} className={`settings-nav-item ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}>
                <i className={`fas ${t.icon}`}></i> {t.label}
              </div>
            ))}
          </div>
        </div>

        <div>
          {tab === 'ldap' && config && (
            <>
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><h3>Połączenie z serwerem LDAP</h3></div>
                <div className="card-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Adres serwera LDAP</label>
                      <input type="text" value={config.serverUrl}
                        onChange={e => setConfig({ ...config, serverUrl: e.target.value })}
                        placeholder="ldap://dc01.firma.local" />
                    </div>
                    <div className="form-group">
                      <label>Port</label>
                      <input type="number" value={config.port}
                        onChange={e => setConfig({ ...config, port: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                      <label>Base DN</label>
                      <input type="text" value={config.baseDn}
                        onChange={e => setConfig({ ...config, baseDn: e.target.value })}
                        placeholder="DC=firma,DC=local" />
                    </div>
                    <div className="form-group">
                      <label>Bind DN</label>
                      <input type="text" value={config.bindDn || ''}
                        onChange={e => setConfig({ ...config, bindDn: e.target.value })}
                        placeholder="CN=ldapuser,OU=Service,DC=firma,DC=local" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input type="checkbox" checked={config.useSsl}
                        onChange={e => setConfig({ ...config, useSsl: e.target.checked })} />
                      Użyj SSL/TLS
                    </label>
                  </div>
                  {testResult && (
                    <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6,
                      background: testResult.includes('pomyślnie') ? 'var(--success-bg)' : 'var(--danger-bg)',
                      color: testResult.includes('pomyślnie') ? 'var(--success)' : 'var(--danger)',
                      fontSize: 13 }}>
                      {testResult}
                    </div>
                  )}
                  <div style={{ marginTop: 12 }}>
                    <button className="btn btn-secondary btn-sm" onClick={handleTestConnection}>
                      <i className="fas fa-plug"></i> Testuj połączenie
                    </button>
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><h3>Wyszukiwanie użytkowników</h3></div>
                <div className="card-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>User Search Base</label>
                      <input type="text" value={config.userSearchBase || ''}
                        onChange={e => setConfig({ ...config, userSearchBase: e.target.value })}
                        placeholder="OU=Users,DC=firma,DC=local" />
                    </div>
                    <div className="form-group">
                      <label>User Search Filter</label>
                      <input type="text" value={config.userSearchFilter || ''}
                        onChange={e => setConfig({ ...config, userSearchFilter: e.target.value })}
                        placeholder="(&(objectClass=user)(objectCategory=person))" />
                    </div>
                    <div className="form-group">
                      <label>Group Search Base</label>
                      <input type="text" value={config.groupSearchBase || ''}
                        onChange={e => setConfig({ ...config, groupSearchBase: e.target.value })}
                        placeholder="OU=Groups,DC=firma,DC=local" />
                    </div>
                    <div className="form-group">
                      <label>Zasięg wyszukiwania</label>
                      <select value={config.searchScope}
                        onChange={e => setConfig({ ...config, searchScope: e.target.value })}>
                        <option value="SUBTREE">Subtree (całe drzewo)</option>
                        <option value="ONE_LEVEL">One Level</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><h3>Mapowanie atrybutów</h3></div>
                <div className="card-body">
                  <div className="form-grid">
                    {[
                      { key: 'attrLogin', label: 'Login', placeholder: 'sAMAccountName' },
                      { key: 'attrFirstName', label: 'Imię', placeholder: 'givenName' },
                      { key: 'attrLastName', label: 'Nazwisko', placeholder: 'sn' },
                      { key: 'attrEmail', label: 'Email', placeholder: 'mail' },
                      { key: 'attrPhone', label: 'Telefon', placeholder: 'telephoneNumber' },
                      { key: 'attrDepartment', label: 'Dział', placeholder: 'department' },
                    ].map(attr => (
                      <div className="form-group" key={attr.key}>
                        <label>{attr.label}</label>
                        <input type="text" value={(config as Record<string, unknown>)[attr.key] as string || ''}
                          onChange={e => setConfig({ ...config, [attr.key]: e.target.value })}
                          placeholder={attr.placeholder} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                  <h3>Mapowanie grup AD → Role</h3>
                </div>
                <div className="card-body">
                  <table>
                    <thead>
                      <tr>
                        <th>Grupa AD</th>
                        <th>Rola TicketFlow</th>
                        <th>Priorytet</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappings.map(m => (
                        <tr key={m.id}>
                          <td><span className="tag"><i className="fas fa-users" style={{ marginRight: 4 }}></i>{m.adGroupName}</span></td>
                          <td>{roleOptions.find(r => r.value === m.ticketFlowRole)?.label || m.ticketFlowRole}</td>
                          <td>{m.priority}</td>
                          <td>
                            <button className="btn btn-danger btn-sm"
                              onClick={() => m.id && ldapService.deleteGroupMapping(m.id).then(() =>
                                setMappings(mappings.filter(x => x.id !== m.id)))}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><h3>Synchronizacja</h3></div>
                <div className="card-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Interwał synchronizacji (minuty)</label>
                      <input type="number" value={config.syncIntervalMinutes}
                        onChange={e => setConfig({ ...config, syncIntervalMinutes: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                      <label>Metoda uwierzytelniania</label>
                      <select value={config.authMethod}
                        onChange={e => setConfig({ ...config, authMethod: e.target.value })}>
                        <option value="LDAP_BIND">LDAP Bind</option>
                        <option value="LOCAL_PASSWORD">Lokalne hasło</option>
                        <option value="SSO_KERBEROS">SSO / Kerberos</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Akcja przy usunięciu z AD</label>
                      <select value={config.adRemovalAction}
                        onChange={e => setConfig({ ...config, adRemovalAction: e.target.value })}>
                        <option value="DISABLE">Wyłącz konto</option>
                        <option value="DELETE">Usuń konto</option>
                        <option value="KEEP">Zachowaj bez zmian</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                    {[
                      { key: 'autoCreateOnLogin', label: 'Auto-tworzenie przy logowaniu' },
                      { key: 'sendWelcomeEmail', label: 'Wyślij powitalnego emaila' },
                      { key: 'logSyncOperations', label: 'Loguj operacje synchronizacji' },
                    ].map(opt => (
                      <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                        <input type="checkbox" checked={(config as Record<string, unknown>)[opt.key] as boolean}
                          onChange={e => setConfig({ ...config, [opt.key]: e.target.checked })} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="btn btn-primary" onClick={handleSaveConfig} disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin"></i> Zapisywanie...</> : <><i className="fas fa-save"></i> Zapisz konfigurację</>}
                </button>
              </div>
            </>
          )}

          {tab !== 'ldap' && (
            <div className="card">
              <div className="card-body" style={{ padding: 60, textAlign: 'center' }}>
                <i className="fas fa-cog" style={{ fontSize: 48, color: 'var(--gray-300)', marginBottom: 16 }}></i>
                <h3 style={{ color: 'var(--gray-500)', marginBottom: 8 }}>Sekcja w przygotowaniu</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>Ta sekcja ustawień będzie dostępna w przyszłej wersji.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
