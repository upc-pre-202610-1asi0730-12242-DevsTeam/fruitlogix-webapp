import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import AutoComplete from 'primevue/autocomplete';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Chart from 'primevue/chart';
import InputSwitch from 'primevue/inputswitch';
import Checkbox from 'primevue/checkbox';

import pinia from './pinia.js'
import i18n from './i18n.js'

const app = createApp(App)

app.use(i18n)
    .use(router)
    .use(pinia)
    .use(PrimeVue, { theme: { preset: Material }, ripple: true })
    .component('pv-autocomplete', AutoComplete)
    .component('pv-select',       Select)
    .component('pv-input-text',   InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-date-picker',  DatePicker)
    .component('pv-button',       Button)
    .component('pv-dialog',       Dialog)
    .component('pv-data-table',   DataTable)
    .component('pv-column',       Column)
    .component('pv-tag',          Tag)
    .component('pv-icon-field',   IconField)
    .component('pv-input-icon',   InputIcon)
    .component('pv-chart',        Chart)
    .component('pv-input-switch',  InputSwitch)
    .component('pv-checkbox',      Checkbox)
    .mount('#app')