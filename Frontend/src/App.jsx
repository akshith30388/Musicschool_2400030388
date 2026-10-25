import { useEffect, useMemo, useState } from 'react'

const API_URL = 'http://localhost:8080/music'

const emptySchool = { schoolName: '', instrument: '', studentCount: '', active: true }
const instrumentIcons = { Piano: '♬', Guitar: '♫', Keyboard: '♪', Drums: '♩', Vocals: '♭' }

function Icon({ name, size = 20 }) {
  const paths = {
    music: <><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    activity: <><path d="M3 12h4l3-9 4 18 3-9h4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    refresh: <><path d="M21 12a9 9 0 0 0-15.2-6.5L3 8" /><path d="M3 3v5h5M3 12a9 9 0 0 0 15.2 6.5L21 16" /><path d="M21 21v-5h-5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" /></>,
    moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z" />,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m-9 0 1 15h8l1-15M10 10v7m4-7v7" /></>,
  }
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function StatCard({ icon, label, value, detail, accent }) {
  return <article className={`stat-card ${accent}`}>
    <div className="stat-icon"><Icon name={icon} size={21} /></div>
    <div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div>
  </article>
}

export default function App() {
  const [schools, setSchools] = useState([])
  const [form, setForm] = useState(emptySchool)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [dark, setDark] = useState(() => localStorage.getItem('music-school-theme') === 'dark')

  useEffect(() => {
    document.body.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('music-school-theme', dark ? 'dark' : 'light')
  }, [dark])

  const loadSchools = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Request failed')
      setSchools(await response.json())
    } catch {
      setNotice({ type: 'danger', text: 'Unable to load your academy records. Check that the backend is running.' })
    } finally { setLoading(false) }
  }

  useEffect(() => { loadSchools() }, [])

  const filteredSchools = useMemo(() => schools.filter((school) => {
    const matchesQuery = `${school.schoolName} ${school.instrument}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (filter === 'all' || (filter === 'active' ? school.active : !school.active))
  }), [schools, query, filter])

  const totalStudents = schools.reduce((sum, school) => sum + Number(school.studentCount || 0), 0)
  const activeSchools = schools.filter((school) => school.active).length
  const instruments = [...new Set(schools.map((school) => school.instrument).filter(Boolean))]

  const handleChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value
    setForm({ ...form, [target.name]: value })
    setErrors({ ...errors, [target.name]: '' })
  }

  const validate = () => {
    const nextErrors = {}
    if (form.schoolName.trim().length < 3) nextErrors.schoolName = 'Use at least 3 characters.'
    if (form.instrument.trim().length < 2) nextErrors.instrument = 'Enter an instrument.'
    const count = Number(form.studentCount)
    if (!Number.isInteger(count) || count < 0 || count > 10000) nextErrors.studentCount = 'Use a whole number from 0 to 10,000.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    const updating = editingId !== null
    try {
      setSaving(true); setNotice(null)
      const response = await fetch(updating ? `${API_URL}/${editingId}` : API_URL, {
        method: updating ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, schoolName: form.schoolName.trim(), instrument: form.instrument.trim(), studentCount: Number(form.studentCount) }),
      })
      if (!response.ok) throw new Error('Save failed')
      setNotice({ type: 'success', text: updating ? 'Academy record updated.' : 'New academy added to your collection.' })
      setForm(emptySchool); setEditingId(null); await loadSchools()
    } catch { setNotice({ type: 'danger', text: 'Could not save the record. Please try again.' }) } finally { setSaving(false) }
  }

  const editSchool = (school) => {
    setForm({ schoolName: school.schoolName, instrument: school.instrument, studentCount: school.studentCount, active: school.active })
    setEditingId(school.id); setErrors({}); setNotice({ type: 'info', text: `Editing ${school.schoolName}.` })
    document.getElementById('add-school')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const deleteSchool = async (id) => {
    if (!window.confirm('Remove this academy record?')) return
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      setNotice({ type: 'success', text: 'Academy record removed.' }); await loadSchools()
    } catch { setNotice({ type: 'danger', text: 'Could not remove this record.' }) }
  }

  const cancelEdit = () => { setForm(emptySchool); setEditingId(null); setErrors({}); setNotice(null) }

  return <div className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <nav className="topbar">
      <a className="brand" href="#home"><span className="brand-mark"><Icon name="music" size={22} /></span><span>Music<span className="brand-accent">School</span></span></a>
      <div className="nav-links"><a className="active" href="#home">Overview</a><a href="#academies">Academies</a><a href="#add-school">Add record</a></div>
      <button className="theme-button" aria-label="Toggle color theme" onClick={() => setDark(!dark)}><Icon name={dark ? 'sun' : 'moon'} size={18} /></button>
    </nav>

    <main id="home" className="page-content">
      <section className="hero">
        <div className="hero-copy"><span className="eyebrow"><span className="pulse-dot" /> MUSIC ACADEMY OS</span>
          <h1>Make space for<br /><em>great music.</em></h1>
          <p>One beautiful home for every academy, instrument, and student you inspire.</p>
          <div className="hero-actions"><a className="button button-primary" href="#academies">Explore academies <Icon name="arrow" size={17} /></a><a className="text-link" href="#add-school">Add a record <Icon name="arrow" size={16} /></a></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="vinyl"><div className="vinyl-label"><Icon name="music" size={26} /></div></div><div className="note note-one">♪</div><div className="note note-two">♫</div><div className="wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="art-caption">LEARN · CREATE · PERFORM</div></div>
      </section>

      <section className="stats-grid" aria-label="Academy overview">
        <StatCard icon="users" label="Students learning" value={totalStudents.toLocaleString()} detail="Across all academies" accent="coral" />
        <StatCard icon="music" label="Academies" value={schools.length} detail={`${activeSchools} currently active`} accent="violet" />
        <StatCard icon="activity" label="Instruments" value={instruments.length} detail="Unique disciplines" accent="gold" />
        <StatCard icon="activity" label="Active ratio" value={schools.length ? `${Math.round(activeSchools / schools.length * 100)}%` : '—'} detail="Academy availability" accent="blue" />
      </section>

      {notice && <div className={`notice ${notice.type}`} role="status"><span>{notice.type === 'success' ? '✓' : '!'}</span>{notice.text}<button aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button></div>}

      <div className="workspace-grid">
        <section id="add-school" className="panel form-panel">
          <div className="panel-heading"><div><span className="section-kicker">{editingId !== null ? 'REFINE RECORD' : 'NEW ENTRY'}</span><h2>{editingId !== null ? 'Update academy' : 'Add an academy'}</h2></div><span className="heading-note">ID auto-generated</span></div>
          <form noValidate onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="schoolName">Academy name<input id="schoolName" name="schoolName" value={form.schoolName} onChange={handleChange} className={errors.schoolName ? 'invalid' : ''} maxLength="100" placeholder="e.g. Harmony House" />{errors.schoolName && <small>{errors.schoolName}</small>}</label>
            <label className="field-label" htmlFor="instrument">Primary instrument<input id="instrument" name="instrument" value={form.instrument} onChange={handleChange} className={errors.instrument ? 'invalid' : ''} maxLength="60" placeholder="e.g. Piano" />{errors.instrument && <small>{errors.instrument}</small>}</label>
            <label className="field-label" htmlFor="studentCount">Students enrolled<input id="studentCount" name="studentCount" type="number" min="0" max="10000" value={form.studentCount} onChange={handleChange} className={errors.studentCount ? 'invalid' : ''} placeholder="0" />{errors.studentCount && <small>{errors.studentCount}</small>}</label>
            <label className="switch-row"><input id="active" name="active" type="checkbox" checked={form.active} onChange={handleChange} /><span className="switch" /><span><strong>Academy is active</strong><small>Visible in the active directory</small></span></label>
            <div className="form-actions"><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editingId !== null ? 'Save changes' : 'Add academy'} <Icon name="arrow" size={16} /></button>{editingId !== null && <button className="button button-ghost" type="button" onClick={cancelEdit}>Cancel</button>}</div>
          </form>
        </section>

        <section id="academies" className="panel records-panel">
          <div className="panel-heading"><div><span className="section-kicker">YOUR COLLECTION</span><h2>Academies <span className="count-pill">{schools.length}</span></h2></div><button className="icon-button" onClick={loadSchools} disabled={loading} aria-label="Refresh academies"><Icon name="refresh" size={17} /></button></div>
          <div className="toolbar"><div className="search-box"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search academies or instruments…" /></div><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter academies"><option value="all">All status</option><option value="active">Active only</option><option value="inactive">Inactive only</option></select></div>
          {loading ? <div className="loading-state"><span className="loader" /><p>Finding your academies…</p></div> : filteredSchools.length === 0 ? <div className="empty-state"><div className="empty-icon">♪</div><h3>{schools.length ? 'No matches found' : 'Your collection is empty'}</h3><p>{schools.length ? 'Try a different search or status filter.' : 'Add your first academy to start building your music network.'}</p></div> : <div className="records-list">{filteredSchools.map((school) => <article className="record-card" key={school.id}><div className="instrument-avatar">{instrumentIcons[school.instrument] || '♪'}</div><div className="record-main"><div className="record-title"><h3>{school.schoolName}</h3><span className={`status ${school.active ? 'active' : 'inactive'}`}><i />{school.active ? 'Active' : 'Paused'}</span></div><p>{school.instrument} <span>·</span> ID #{school.id}</p></div><div className="student-total"><strong>{Number(school.studentCount).toLocaleString()}</strong><span>students</span></div><div className="record-actions"><button onClick={() => editSchool(school)} aria-label={`Edit ${school.schoolName}`}><Icon name="edit" size={16} /></button><button onClick={() => deleteSchool(school.id)} aria-label={`Delete ${school.schoolName}`}><Icon name="trash" size={16} /></button></div></article>)}</div>}
        </section>
      </div>
      <footer><span>© {new Date().getFullYear()} MusicSchool</span><span>Built for people who make music <span className="footer-note">♪</span></span></footer>
    </main>
  </div>
}
