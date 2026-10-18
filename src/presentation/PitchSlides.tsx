import { ArrowRight, AudioLines, Box, Check, Gamepad2, GraduationCap, Heart, Layers3, MapPin, NotebookPen, Play, ScanEye, ShieldCheck, Users } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { asset } from '@/lib/asset';
import config from './pitch.config.json';
import { LiveScene, SceneMotion, type PitchWorld } from './LiveScene';

function Heading({ label, children, sub }: { label: string; children: ReactNode; sub?: string }) {
  return <div className="pitch-heading"><p className="pitch-eyebrow">{label}</p><h1>{children}</h1>{sub && <p className="pitch-lead">{sub}</p>}</div>;
}

export function Cover() {
  return <div className="pitch-content pitch-cover-v2">
    <div className="pitch-cover-copy"><div className="pitch-wordmark"><img src={asset('/favicon.svg')} alt="" /><span>Object<span>Talk</span></span></div>
      <h1>English practice.<br /><em>Played together.</em></h1>
      <p className="pitch-cover-sub">A 3D co-op game for learning English.<br />Play with a parent, a friend, or AI.</p>
      <div className="pitch-cover-key"><Users size={25} /><span>Two players</span><i /><Gamepad2 size={25} /><span>In your browser</span></div>
      <p className="pitch-cover-team">Team {config.teamName}</p>
    </div>
    <div className="pitch-cover-native"><LiveScene world="study" label="Two players at a shared desk in Cozy Study" /><div className="pitch-native-caption"><span>COZY STUDY</span><b>“The rocket on your left.”</b></div></div>
  </div>;
}

export function Team() {
  const members: { name: string; role: string; photo?: string; detail?: string }[] = config.team;
  const responsibilities = ['Everyday tasks and clear scene design', 'Shared rooms, controls and 3D interaction', 'AI teammates, asset generation and validation'];
  const icons = [NotebookPen, Gamepad2, Box];
  return <div className="pitch-content pitch-team-page">
    <Heading label="01 / OUR TEAM">The team behind <em>ObjectTalk</em></Heading>
    <p className="pitch-team-intro">We bring product design, realtime gameplay and AI content tools into one playable experience.</p>
    <div className="pitch-member-grid">{members.map((member, i) => {
      const Icon = icons[i % icons.length];
      return <article className={member.photo ? 'has-photo' : ''} key={member.name || member.role}>
        {member.photo ? <img className="pitch-member-photo" src={asset(member.photo)} alt={member.name} /> : <Icon className="pitch-member-icon" size={48} aria-hidden="true" />}
        {member.name && <h2>{member.name}</h2>}
        <h3>{member.role}</h3><p>{member.detail || responsibilities[i % responsibilities.length]}</p>
      </article>;
    })}</div>
    <p className="pitch-team-result">Together, we built the game, the AI partner and the workflow for new playable content.</p>
  </div>;
}

export function Problem() {
  return <div className="pitch-content pitch-problem">
    <Heading label="02 / WHY WE BUILT IT">More exposure. <em>Too little conversation.</em></Heading>
    <div className="pitch-problem-layout"><div className="pitch-problem-copy">
      <div><span>AT HOME</span><h2>Books and audio.<br />But who do you talk to?</h2><p>Kids hear English.<br />They need a reason to use it.</p></div>
      <div><span>IN CLASS</span><h2>Role-play works.<br />It takes time to set up.</h2><p>Teachers prepare the setting,<br />the props, and the activity.</p></div>
      <strong>Our starting question: can a shared game make everyday English useful?</strong>
    </div><div className="pitch-problem-scene"><LiveScene world="cafe" /><div className="pitch-native-caption"><span>CORNER CAFÉ</span><b>“Two croissants, please.”</b></div></div></div>
  </div>;
}

export function Mechanics() {
  return <div className="pitch-content pitch-mechanics-v2"><Heading label="02 / HOW IT WORKS" sub="Each player has different information. You have to talk to finish the task.">You see the goal. <em>I make the move.</em></Heading>
    <div className="pitch-duo-v2"><article><LiveScene world="study" role="guide" /><span className="pitch-role tone-peach"><ScanEye size={22} /> Guide / sees the goal</span><div><h2>“Move the rocket next to the books.”</h2><p>Describe what goes where.</p></div></article><span className="pitch-duo-audio"><AudioLines size={35} /></span><article><LiveScene world="study" role="builder" /><span className="pitch-role tone-sky"><Gamepad2 size={22} /> Builder / moves the objects</span><div><h2>“My left or your left?”</h2><p>Listen, ask, then act.</p></div></article></div>
    <div className="pitch-mechanics-outcome"><span><Users size={26} /> Human or AI teammate</span><span><Check size={26} /> A shared task to complete</span><span><NotebookPen size={26} /> AI feedback after each round</span></div>
  </div>;
}

export function DemoFilm({ source, onEnded }: { source: string; onEnded: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let mounted = true;
    const retry = () => {
      if (element.paused && !element.ended) {
        if (element.error) element.load();
        void element.play().catch(() => undefined);
      }
    };
    // A direct URL may not yet have browser permission to play with sound.
    // Retry on the next gesture without putting UI over the film.
    void element.play().catch(() => {
      if (mounted) {
        window.addEventListener('pointerdown', retry);
        window.addEventListener('keydown', retry);
      }
    });
    return () => {
      mounted = false;
      window.removeEventListener('pointerdown', retry);
      window.removeEventListener('keydown', retry);
      element.pause();
    };
  }, [source]);
  return <div className="pitch-film" aria-label="ObjectTalk product demo">
    <video ref={video} src={source} autoPlay playsInline preload="auto" disablePictureInPicture disableRemotePlayback tabIndex={-1} onEnded={onEnded} aria-label="ObjectTalk product demo" />
  </div>;
}

export function Difference() {
  return <div className="pitch-content pitch-difference-v2"><Heading label="04 / OUR ADVANTAGES & PRODUCT COMPARISON">Co-op gameplay, <em>with AI feedback</em></Heading>
    <div className="pitch-difference-layout"><div className="pitch-difference-copy">
    <div className="pitch-comparison" role="table" aria-label="Product comparison"><div className="pitch-comparison-row pitch-comparison-head" role="row"><span role="columnheader">Product</span><span role="columnheader">Noun Town</span><span role="columnheader">Duolingo Video Call</span><span role="columnheader" className="pitch-our-column">ObjectTalk</span></div>{[
      ['Practice', 'Vocabulary through exploration', 'Conversation with an AI character', 'English to complete a shared task'],
      ['Interaction', 'Objects and mini-games', 'Free-flowing AI conversation', 'Parent, friend, or AI teammate'],
    ].map(row => <div className="pitch-comparison-row" role="row" key={row[0]}>{row.map((cell, i) => <span role="cell" key={cell} className={i === 3 ? 'pitch-our-column' : ''}>{cell}</span>)}</div>)}</div>
    <div className="pitch-difference-bottom"><h2>One player sees the goal. The other acts.</h2><p>Describe the object, clarify the direction and finish the task together.</p><strong>AI feedback connects your conversation to what happened in the game.</strong></div>
    <p className="pitch-source">Sources: <a href="https://noun.town/language-learning-game/" target="_blank" rel="noreferrer">Noun Town</a> · <a href="https://blog.duolingo.com/video-call/" target="_blank" rel="noreferrer">Duolingo Video Call</a></p>
    </div><div className="pitch-difference-native"><LiveScene world="study" label="Two players collaborating in Cozy Study" /></div></div>
  </div>;
}

export function Customers() {
  return <div className="pitch-content pitch-customers"><Heading label="03 / OUR TARGET USERS">Young learners, <em>supported by adults</em></Heading>
    <div className="pitch-customer-layout"><div className="pitch-customer-copy"><div className="pitch-customer-columns"><article><span><Heart size={25} /> PRIMARY USERS / FAMILIES</span><h2>Children + parents</h2><p>Young English learners who need speaking practice.<br />Parents who want something to do together.</p></article><article><span><GraduationCap size={27} /> PILOT PARTNERS / CLASSES & CLUBS</span><h2>English teachers + learning groups</h2><p>Teachers who need reusable role-play tasks.<br />Small groups that can practise in pairs.</p></article></div><div className="pitch-course-example"><span>FIRST USE CASE / ORDERING FOOD</span><p>A child and parent play customer and server.<br />A teacher can reuse the same task in class.</p></div></div>
    <div className="pitch-classroom-scene"><LiveScene world="cafe" /><div className="pitch-native-caption"><span>CORNER CAFÉ</span><b>Same café. A new conversation.</b></div></div></div>
  </div>;
}

const workflow = [
  { icon: NotebookPen, title: 'Planner', sub: 'Plan roles and tasks', tone: 'peach' },
  { icon: ScanEye, title: 'Reference', sub: 'Select and review assets', tone: 'lavender' },
  { icon: Box, title: 'Rodin', sub: 'Generate 3D assets', tone: 'sun' },
  { icon: Layers3, title: 'Builder', sub: 'Assemble the scene', tone: 'sky' },
  { icon: ShieldCheck, title: 'Verify', sub: 'Test the playable task', tone: 'mint' },
];

export function Harness() {
  const [selected, setSelected] = useState<'music' | 'fruit'>('fruit');
  return <div className="pitch-content pitch-harness-v2"><Heading label="07 / TECHNOLOGY & CORE ENGINEERING" sub="Our Scene Agent plans content. Shared game rules check that it is playable.">Scene Agent, <em>backed by game rules</em></Heading>
    <div className="pitch-tech-stack" aria-label="Technology stack"><span>React + TypeScript</span><span>Three.js</span><span>Node.js + Socket.IO</span><span>LLM tools + Hyper3D Rodin</span></div>
    <div className="pitch-pipeline">{workflow.map((step, i) => <div className={`pitch-pipeline-step tone-${step.tone}`} key={step.title}><span className="pitch-step-number">0{i + 1}</span><step.icon size={35} /><h2>{step.title}</h2><p>{step.sub}</p>{i < 4 && <ArrowRight className="pitch-pipeline-arrow" size={26} />}</div>)}</div>
    <div className="pitch-generated-proof"><div><span className="pitch-proof-label"><Check size={20} /> TWO SHIPPED AGENT-MADE LEVELS</span><h2>Music Room<br />Fruit Market</h2><p>Generated assets in supported game templates.<br />All sampled tasks must pass before publication.</p><div className="pitch-scene-switch" role="group" aria-label="Choose a generated scene"><button aria-pressed={selected === 'music'} onClick={() => setSelected('music')}>Music Room</button><button aria-pressed={selected === 'fruit'} onClick={() => setSelected('fruit')}>Fruit Market</button></div></div><div className="pitch-generated-native">{(['fruit', 'music'] as const).map(world => <div key={world} className={`pitch-generated-layer ${selected === world ? 'is-active' : ''}`} aria-hidden={selected !== world} inert={selected !== world}><SceneMotion active={selected === world}><LiveScene world={world} /></SceneMotion></div>)}</div></div>
    <div className="pitch-engineering-proof"><p><b>Game state controls the AI</b>Role-specific views and bounded actions protect the task.</p><p><b>Reusable content, verified tasks</b>Shared schemas connect assets, missions and playability checks.</p></div>
    <p className="pitch-rodin-credit"><Box size={23} /> 3D generation: <a href="https://hyper3d.ai/" target="_blank" rel="noreferrer">Hyper3D Rodin</a><span>With thanks to the Rodin team</span></p>
  </div>;
}

const worlds: { id: PitchWorld; title: string; english: string; task: string; phrase: string }[] = [
  { id: 'cafe', title: 'At the café', english: 'Corner Café', task: 'Quantities and polite requests', phrase: '“Two croissants, please.”' },
  { id: 'town', title: 'Around town', english: 'Toy Town', task: 'Directions and landmarks', phrase: '“Turn left at the bank.”' },
  { id: 'night', title: 'At the night market', english: 'Night Market', task: 'Orders and multi-step tasks', phrase: '“A large bubble tea, please.”' },
  { id: 'study', title: 'At the desk', english: 'Cozy Study', task: 'Objects and positions', phrase: '“The rocket on your left.”' },
];

export function ContentWorld() {
  const [selected, setSelected] = useState(2);
  const world = worlds[selected];
  return <div className="pitch-content pitch-content-world"><Heading label="05 / FEATURES & LIVE SCENES">Speak, act, <em>then review together</em></Heading>
    <div className="pitch-world-explorer"><div className="pitch-world-menu" role="group" aria-label="Choose a scene">{worlds.map((item, i) => <button aria-pressed={i === selected} key={item.id} onClick={() => setSelected(i)}><span>0{i + 1}</span><div><b>{item.title}</b><small>{item.task}</small></div><ArrowRight size={22} /></button>)}</div><div className="pitch-world-native"><LiveScene key={world.id} world={world.id} /><div className="pitch-native-caption"><span>{world.english.toUpperCase()}</span><b>{world.phrase}</b></div></div></div>
    <div className="pitch-reuse-row"><span><Users /> Human or AI teammate</span><span><AudioLines /> Voice and text</span><span><NotebookPen /> Replay + AI feedback</span><strong>One player sees the goal. The other makes the move.</strong></div>
  </div>;
}

export function Business() {
  return <div className="pitch-content pitch-business-v2"><Heading label="08 / BUSINESS MODEL & PILOT PLAN">Business model <em>and first pilots</em></Heading>
    <div className="pitch-commercial-layout"><div className="pitch-commercial-main"><div className="pitch-commercial-steps"><span><b>01</b>Community trials</span><ArrowRight /><span><b>02</b>Free scenes</span><ArrowRight /><span><b>03</b>Paid themes</span></div>
      <div className="pitch-revenue-line"><Heart size={31} /><div><span>FAMILIES</span><h2>Scene packs + family subscriptions</h2><p>New themes and harder tasks as kids progress.</p></div></div><div className="pitch-revenue-line"><GraduationCap size={32} /><div><span>CLASSES & CLUBS</span><h2>Curriculum packs + custom scenes</h2><p>Match lesson topics. Reuse in class and at home.</p></div></div>
      <div className="pitch-renewal"><MapPin size={24} /><p>Proposed model:<br /><b>new scenes and tasks to come back to.</b></p></div>
    </div><div className="pitch-cost-structure"><span>NEXT / SMALL PILOTS</span><h2>Learn from families.<br /><em>Test with classes.</em></h2><div><b>Family playtests</b><p>Observe whether pairs finish a task,<br />where they get stuck and whether they return.</p></div><div><b>Classroom pilots</b><p>Match one scene to a lesson.<br />Check setup effort and speaking participation.</p></div><small>Planned next steps. Pricing and learning outcomes need validation.</small></div></div>
  </div>;
}

export function Future() {
  return <div className="pitch-content pitch-future-v3"><div className="pitch-closing-copy"><div className="pitch-wordmark"><img src={asset('/favicon.svg')} alt="" /><span>Object<span>Talk</span></span></div><h1>Thank you.</h1><p className="pitch-closing-message">A game to play together.<br /><em>A reason to speak English.</em></p><div className="pitch-closing-invitation"><h2>Looking for families to playtest</h2><p>And English classes to pilot with us.</p></div><Link className="pitch-play-link" to={config.playUrl}><Play size={22} /> Try ObjectTalk <ArrowRight size={22} /></Link><span className="pitch-closing-thanks">Team {config.teamName}</span></div><div className="pitch-closing-native"><LiveScene world="study" label="Two players and their shared desk in Cozy Study" /></div></div>;
}
