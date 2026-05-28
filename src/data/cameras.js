// South Australia Marine Cams — camera data
// Feeds powered by Verkada embeds from marinesafety.sa.gov.au

export const REGION_COLORS = {
  'Metropolitan Adelaide': '#0B5CAB',
  'Fleurieu Peninsula':    '#2d7d46',
  'Yorke Peninsula':       '#b06d00',
  'Eyre Peninsula':        '#7b1fa2',
  'River Murray':          '#00838f',
};

export const cameras = [
  // Metropolitan Adelaide
  { id: 'st-kilda-ramp',      name: 'St Kilda Boat Ramp',          region: 'Metropolitan Adelaide', lat: -34.7344, lng: 138.5323, embedId: '54b486dd-c944-43e4-8f9f-eea16d8f223a' },
  { id: 'st-kilda-channel',   name: 'St Kilda Channel',             region: 'Metropolitan Adelaide', lat: -34.7350, lng: 138.5330, embedId: '3c454a6f-b106-4802-8ccf-cd813e8e9024' },
  { id: 'outer-harbor',       name: 'Outer Harbor',                 region: 'Metropolitan Adelaide', lat: -34.8358, lng: 138.4800, embedId: '4fde77b4-aa73-4402-b2a7-f0eef510f067' },
  { id: 'north-haven-ramp',   name: 'North Haven Boat Ramp',        region: 'Metropolitan Adelaide', lat: -34.7861, lng: 138.5006, embedId: '9886797d-15d3-4f90-87f4-99eda6ed4fb7' },
  { id: 'west-beach-ramp',    name: 'West Beach Boat Ramp',         region: 'Metropolitan Adelaide', lat: -34.9417, lng: 138.5057, embedId: 'd948a62d-d3b2-440b-a2b4-bd6ee976424d' },
  { id: 'osullivan-ramp',     name: "O'Sullivan Beach Boat Ramp",   region: 'Metropolitan Adelaide', lat: -35.1161, lng: 138.4694, embedId: 'bb47c7f4-cf98-4815-8b3f-80dca9d635ef' },
  // Fleurieu Peninsula
  { id: 'wirrina-ramp',       name: 'Wirrina Cove Boat Ramp',       region: 'Fleurieu Peninsula',    lat: -35.4764, lng: 138.3253, embedId: '658b06e9-9d11-44e7-9918-a9d9233a01e9' },
  { id: 'wirrina-breakwater', name: 'Wirrina Cove Breakwater',      region: 'Fleurieu Peninsula',    lat: -35.4770, lng: 138.3260, embedId: '56abb6d2-3c27-412a-9b26-6b775b291c54' },
  // Yorke Peninsula
  { id: 'ardrossan-ramp',     name: 'Ardrossan Boat Ramp',          region: 'Yorke Peninsula',       lat: -34.4228, lng: 137.9197, embedId: '6f40a1c5-b8bc-4f9a-984c-03ec27938e48' },
  { id: 'edithburgh-ramp',    name: 'Edithburgh Boat Ramp',         region: 'Yorke Peninsula',       lat: -35.0839, lng: 137.7458, embedId: '34eb7dd2-e9f5-4fab-8870-9db73955a9bf' },
  { id: 'marion-bay-ramp',    name: 'Marion Bay Boat Ramp',         region: 'Yorke Peninsula',       lat: -35.2236, lng: 137.0136, embedId: '844ff3c7-f61c-4a5c-8296-e5f4c4feba7b' },
  { id: 'point-turton-ramp',  name: 'Point Turton Boat Ramp',       region: 'Yorke Peninsula',       lat: -34.9297, lng: 137.8422, embedId: 'b344f20c-a3c2-4fa5-8045-825217a36746' },
  { id: 'port-hughes-ramp',   name: 'Port Hughes Boat Ramp',        region: 'Yorke Peninsula',       lat: -34.0844, lng: 137.9614, embedId: 'a16e8f9c-6b53-4928-87bd-34cb224ffdbb' },
  { id: 'port-vincent-bay',   name: 'Port Vincent Bay',             region: 'Yorke Peninsula',       lat: -34.7775, lng: 137.8594, embedId: '025864c0-b3a0-482a-bb88-976ba92f6276' },
  { id: 'port-vincent-ramp',  name: 'Port Vincent Boat Ramp',       region: 'Yorke Peninsula',       lat: -34.7780, lng: 137.8600, embedId: 'f1e25e34-508d-479e-8ac6-8dda64306ec0' },
  { id: 'stansbury-ramp',     name: 'Stansbury Boat Ramp',          region: 'Yorke Peninsula',       lat: -34.9142, lng: 137.7950, embedId: '1762c0bf-c5fc-4ef5-8a73-60182487f1a5' },
  { id: 'wallaroo-ramp',      name: 'Wallaroo Boat Ramp',           region: 'Yorke Peninsula',       lat: -33.9328, lng: 137.6244, embedId: 'e14c634e-a9d6-406b-9f32-a74278739330' },
  // Eyre Peninsula
  { id: 'whyalla-ramp',       name: 'Whyalla Boat Ramp',            region: 'Eyre Peninsula',        lat: -33.0338, lng: 137.5836, embedId: '6f9af85b-ceb3-44b4-9066-64854de519a9' },
  // River Murray
  { id: 'mannum-upstream',    name: 'Mannum Upstream',              region: 'River Murray',          lat: -34.9178, lng: 139.2999, embedId: '69dddcbf-2edf-40a4-9eac-dc6bd9bcebcb' },
  { id: 'mannum-downstream',  name: 'Mannum Downstream',            region: 'River Murray',          lat: -34.9185, lng: 139.3005, embedId: 'd43c9867-80f5-43c8-a628-402f6b60b72e' },
];

export function getCamerasByRegion() {
  const order = ['Metropolitan Adelaide','Fleurieu Peninsula','Yorke Peninsula','Eyre Peninsula','River Murray'];
  return order.map(region => ({
    region,
    color: REGION_COLORS[region],
    data: cameras.filter(c => c.region === region),
  }));
}

export function getEmbedUrl(embedId) {
  return `https://vauth.command.verkada.com/embed/html/${embedId}/`;
}
