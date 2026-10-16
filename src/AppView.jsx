// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import RailNav from './screens/RailNav.jsx';
import BottomNav from './screens/BottomNav.jsx';
import Sheet from './screens/Sheet.jsx';
import Welcome from './screens/Welcome.jsx';
import Home from './screens/Home.jsx';
import MapScreen from './screens/MapScreen.jsx';
import Gear from './screens/Gear.jsx';
import Rest from './screens/Rest.jsx';
import Parent from './screens/Parent.jsx';
import Practice from './screens/Practice.jsx';
import Mission from './screens/Mission.jsx';

// Layout shell: picks the active screen and navigation from the flat view-model `v` (App.renderVals()).
export default function AppView({ v }) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#102D35',
        color: '#F6EAD2',
        fontFamily: "'Nunito Sans',system-ui,sans-serif",
        fontSize: '18px',
        lineHeight: '1.5',
        display: 'flex',
        flexDirection: v.rootDir
      }}
    >
      {v.showRail ? <RailNav v={v} /> : null}
      <main style={{ flex: '1', minWidth: '0', position: 'relative', paddingBottom: v.mainPadBottom }}>
        {v.sWelcome ? <Welcome v={v} /> : null}
        {v.sHome ? <Home v={v} /> : null}
        {v.sMap ? <MapScreen v={v} /> : null}
        {v.sGear ? <Gear v={v} /> : null}
        {v.sRest ? <Rest v={v} /> : null}
        {v.sParent ? <Parent v={v} /> : null}
        {v.sPractice ? <Practice v={v} /> : null}
        {v.sMission ? <Mission v={v} /> : null}
      </main>
      {v.showBottomNav ? <BottomNav v={v} /> : null}
      {v.sheetOpen ? <Sheet v={v} /> : null}
    </div>
  );
}
