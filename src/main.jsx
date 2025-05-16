import './polyfill.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "react-toastify/dist/ReactToastify.css";
import 'font-awesome/css/font-awesome.min.css';

import 'tinymce/tinymce'; // core
import 'tinymce/icons/default';
import 'tinymce/themes/silver'; // giao diện
import 'tinymce/models/dom'; // model cho browser
import 'tinymce/skins/ui/oxide/skin.min.css'; // skin cơ bản

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
