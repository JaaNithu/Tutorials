// Third-party Imports
import type { Action } from 'kbar'

export type SearchData = Action & {
  url: string
}

const data: SearchData[] = [
  {
    id: '1',
    name: 'CRM',
    url: '/dashboards',
    icon: 'ri-pie-chart-2-line',
    section: 'Dashboard'
  },
  {
    id: '16',
    name: 'Account Settings',
    url: '/pages/account-settings',
    icon: 'ri-user-settings-line',
    section: 'Pages'
  },
  {
    id: '50',
    name: 'React Table',
    url: '/react-table',
    icon: 'ri-table-alt-line',
    section: 'Forms & Tables'
  },
  {
    id: '53',
    name: 'Menu Examples',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`,
    icon: 'ri-menu-add-line',
    section: 'Others'
  },
  {
    id: '54',
    name: 'Typography',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/typography`,
    icon: 'ri-text',
    section: 'User Interface'
  },
  {
    id: '55',
    name: 'Icons',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/icons`,
    icon: 'ri-remixicon-line',
    section: 'User Interface'
  },
  {
    id: '56',
    name: 'Accordion',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/accordion`,
    icon: 'ri-fullscreen-exit-line',
    section: 'Components'
  },
  {
    id: '57',
    name: 'Alerts',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/alerts`,
    icon: 'ri-alert-line',
    section: 'Components'
  },
  {
    id: '58',
    name: 'Avatars',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/avatars`,
    icon: 'ri-account-circle-line',
    section: 'Components'
  },
  {
    id: '59',
    name: 'Badges',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/badges`,
    icon: 'ri-notification-badge-line',
    section: 'Components'
  },
  {
    id: '60',
    name: 'Buttons',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/buttons`,
    icon: 'ri-download-2-line',
    section: 'Components'
  },
  {
    id: '61',
    name: 'Button Group',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/button-group`,
    icon: 'ri-file-copy-line',
    section: 'Components'
  },
  {
    id: '62',
    name: 'Chips',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/chips`,
    icon: 'ri-text-snippet',
    section: 'Components'
  },
  {
    id: '63',
    name: 'Dialogs',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/dialogs`,
    icon: 'ri-tv-2-line',
    section: 'Components'
  },
  {
    id: '64',
    name: 'List',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/list`,
    icon: 'ri-list-ordered',
    section: 'Components'
  },
  {
    id: '65',
    name: 'Menu',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/menu`,
    icon: 'ri-menu-line',
    section: 'Components'
  },
  {
    id: '66',
    name: 'Pagination',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/pagination`,
    icon: 'ri-skip-right-line',
    section: 'Components'
  },
  {
    id: '67',
    name: 'Progress',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/progress`,
    icon: 'ri-progress-3-line',
    section: 'Components'
  },
  {
    id: '68',
    name: 'Ratings',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/ratings`,
    icon: 'ri-star-line',
    section: 'Components'
  },
  {
    id: '69',
    name: 'Snackbar',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/snackbar`,
    icon: 'ri-message-3-line',
    section: 'Components'
  },
  {
    id: '70',
    name: 'Swiper',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/swiper`,
    icon: 'ri-slideshow-4-line',
    section: 'Components'
  },
  {
    id: '71',
    name: 'Tabs',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/tabs`,
    icon: 'ri-tv-2-line',
    section: 'Components'
  },
  {
    id: '72',
    name: 'Timeline',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/timeline`,
    icon: 'ri-timeline-view',
    section: 'Components'
  },
  {
    id: '73',
    name: 'Toasts',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/toasts`,
    icon: 'ri-notification-2-line',
    section: 'Components'
  },
  {
    id: '74',
    name: 'More Components',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components/more`,
    icon: 'ri-layout-grid-line',
    section: 'Components'
  },
  {
    id: '75',
    name: 'Text Field',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/text-field`,
    icon: 'ri-input-field',
    section: 'Forms & Tables'
  },
  {
    id: '76',
    name: 'Select',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/select`,
    icon: 'ri-list-check',
    section: 'Forms & Tables'
  },
  {
    id: '77',
    name: 'Checkbox',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/checkbox`,
    icon: 'ri-checkbox-line',
    section: 'Forms & Tables'
  },
  {
    id: '78',
    name: 'Radio',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/radio`,
    icon: 'ri-radio-button-line',
    section: 'Forms & Tables'
  },
  {
    id: '79',
    name: 'Custom Inputs',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/custom-inputs`,
    icon: 'ri-list-radio',
    section: 'Forms & Tables'
  },
  {
    id: '80',
    name: 'Textarea',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/textarea`,
    icon: 'ri-rectangle-line',
    section: 'Forms & Tables'
  },
  {
    id: '81',
    name: 'Autocomplete',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/autocomplete`,
    icon: 'ri-list-check',
    section: 'Forms & Tables'
  },
  {
    id: '83',
    name: 'Switch',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/switch`,
    icon: 'ri-toggle-line',
    section: 'Forms & Tables'
  },
  {
    id: '84',
    name: 'File Uploader',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/file-uploader`,
    icon: 'ri-file-upload-line',
    section: 'Forms & Tables'
  },
  {
    id: '85',
    name: 'Editor',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/editor`,
    icon: 'ri-ai-generate',
    section: 'Forms & Tables'
  },
  {
    id: '86',
    name: 'Slider',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements/slider`,
    icon: 'ri-equalizer-2-line',
    section: 'Forms & Tables'
  },
  {
    id: '87',
    name: 'MUI Tables',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`,
    icon: 'ri-table-2',
    section: 'Forms & Tables'
  }
]

export default data
