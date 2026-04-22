export interface MenuItemTypes {
  key: string;
  label: React.ReactNode;   // ✅ string → ReactNode
  isTitle?: boolean;
  icon?: string;
  url?: string;
  parentKey?: string;
  target?: string;
  children?: MenuItemTypes[];
}

const MENU_ITEMS: MenuItemTypes[] = [
  {
    key: 'menu',
    label: 'Menu',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    isTitle: false,
    icon: 'mgc_home_3_line',
    url: '/dashboard'
  },
  {
    key: 'apps',
    label: 'Apps',
    isTitle: true,
  },
  {
    key: 'apps-calendar',
    label: 'ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು (TP)',
    isTitle: false,
    icon: 'mgc_calendar_line',
    url: '/apps/calendar',
  },

  {
    key: 'apps-project',
    label: ' ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ',
    isTitle: false,
    icon: 'mgc_building_2_line',
    children: [
      {
    key: 'apps-tarikere',
    label: 'ತರೀಕೆರೆ (ತಾ)',
    isTitle: false,
    icon: 'mgc_folder_2_line',
    url: '/apps/taluk/tarikere',
      },

       {
         key: 'apps-ajjampura',
    label: 'ಅಜ್ಜಂಪುರ (ತಾ)',
    isTitle: false,
    icon: 'mgc_folder_2_line',
    url: '/apps/taluk/ajjampura',
      },

      {
  key: 'apps-purasabe',
  label: 'ಪುರಸಭೆ ತರೀಕೆರೆ',
  icon: 'mgc_folder_2_line',
  url: '/apps/panchayath/purasabetarikere',
},

{
  key: 'apps-panchayath',
  label: (<>
      ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ <br/> ಅಜ್ಜಂಪುರ
    </>
  ),
  icon: 'mgc_folder_2_line',
  url: '/apps/panchayath/panchayathajjampura',
},


// {
//   key: 'apps-manavifilter',
//   label: (<>
//       ಮನವಿ Filter
//     </>
//   ),
//   icon: 'mgc_folder_2_line',
//   url: '/apps/consolidation',
// },


// {
//   key: 'apps-workfilter',
//   label: (<>
//       work Filter
//     </>
//   ),
//   icon: 'mgc_folder_2_line',
//   url: '/apps/consolidationwork',
// }
     
    ]
  },

  {
    key: 'apps-statistics',
    label: 'ಅಂಕಿ-ಅಂಶಗಳು',
    isTitle: false,
    icon: 'mgc_folder_2_line',
    url: '/apps/statdata',
  },

  {
    key: 'apps-govtoffice',
    label: 'ಇಲಾಖೆಗಳ ಸಂಪರ್ಕ',
    isTitle: false,
    icon: 'mgc_folder_2_line',
    url: '/apps/govtoffice',
  },

  {
    key: 'apps',
    label: 'ಅಧಿವೇಶನ',
    isTitle: false,
    icon: 'mgc_folder_2_line',
    url: '/apps/adhiveshana',
  },

  {
    key: 'apps',
    label: 'MLA-LAD',
    isTitle: false,
    icon: 'mgc_folder_2_line',
    url: '/apps/mlaladd',
  },

  {
    key: 'apps',
    label: 'ವಿವಿಧ ಅನುದಾನಗಳು',
    isTitle: false,
    icon: 'mgc_folder_2_line',
    url: '/apps/schem',
  },

  {
    key: 'apps',
    label: 'GOVT Links',
    isTitle: false,
    icon: 'mgc_folder_2_line',
    url: '/apps/govtlinks',
  },

];

export { MENU_ITEMS };
