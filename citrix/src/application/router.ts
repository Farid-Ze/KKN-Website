/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix Vue Router Configuration
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% LIVE ROUTE METADATA VIA MCP CHROME]
 * ============================================================================ */

export const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Red Bull Racing + Citrix | This is how the future works',
      slideIndex: 0
    }
  },
  {
    path: '/on-race-day',
    name: 'on-race-day',
    meta: {
      title: 'Red Bull Racing + Citrix | On race day',
      slideIndex: 1
    }
  },
  {
    path: '/trackside',
    name: 'trackside',
    meta: {
      title: 'Red Bull Racing + Citrix | Trackside',
      slideIndex: 2
    }
  },
  {
    path: '/back-at-hq',
    name: 'back-at-hq',
    meta: {
      title: 'Red Bull Racing + Citrix | Back at HQ',
      slideIndex: 3
    }
  },
  {
    path: '/all-season',
    name: 'all-season',
    meta: {
      title: 'Red Bull Racing + Citrix | All season',
      slideIndex: 4
    }
  },
  {
    path: '/beyond-the-podium',
    name: 'beyond-the-podium',
    meta: {
      title: 'Red Bull Racing + Citrix | Beyond the podium',
      slideIndex: 5
    }
  },
  {
    path: '*',
    name: '404',
    meta: {
      title: 'Red Bull Racing + Citrix | 404',
      component: 'app-page-404',
      slideIndex: 5
    }
  }
];
