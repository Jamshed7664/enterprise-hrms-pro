import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Inline SVG icons: consistent stroke styling, no icon font, CDN or extra npm package.
const ICONS: Record<string, string[]> = {
  dashboard: ['M3 3h8v8H3z', 'M13 3h8v5h-8z', 'M13 10h8v11h-8z', 'M3 13h8v8H3z'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8'],
  'user-plus': ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2','M9 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8','M20 8v6','M17 11h6'],
  building: ['M3 21h18','M5 21V5l7-3 7 3v16','M9 9h1','M14 9h1','M9 13h1','M14 13h1','M11 21v-4h2v4'],
  calendar: ['M8 2v4','M16 2v4','M3 10h18','M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
  clock: ['M12 22a10 10 0 1 0 0-20a10 10 0 0 0 0 20','M12 6v6l4 2'],
  wallet: ['M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H5','M22 12h-5a2 2 0 0 0 0 4h5'],
  target: ['M12 22a10 10 0 1 0 0-20a10 10 0 0 0 0 20','M12 18a6 6 0 1 0 0-12a6 6 0 0 0 0 12','M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4'],
  briefcase: ['M3 7h18v13H3z','M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2','M3 12h18','M10 12v2h4v-2'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M8 13h8','M8 17h8'],
  chart: ['M3 3v18h18','M7 16l4-4 3 2 5-7'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z','M9 12l2 2 4-4'],
  settings: ['M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6', 'M19.4 15a2 2 0 0 0 .4 2.2l-2 2a2 2 0 0 0-2.2-.4l-1 .5a2 2 0 0 0-1.6 1.7h-2a2 2 0 0 0-1.6-1.7l-1-.5a2 2 0 0 0-2.2.4l-2-2a2 2 0 0 0 .4-2.2l-.5-1A2 2 0 0 0 2 12v-2a2 2 0 0 0 1.7-1.6l.5-1A2 2 0 0 0 3.8 5l2-2a2 2 0 0 0 2.2.4l1-.5A2 2 0 0 0 10.6 1h2a2 2 0 0 0 1.6 1.7l1 .5a2 2 0 0 0 2.2-.4l2 2a2 2 0 0 0-.4 2.2l.5 1A2 2 0 0 0 21 10v2a2 2 0 0 0-1.6 1.6z'],
  moon: ['M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13z'],
  sun: ['M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8','M12 2v2','M12 20v2','M4.93 4.93l1.42 1.42','M17.65 17.65l1.42 1.42','M2 12h2','M20 12h2','M4.93 19.07l1.42-1.42','M17.65 6.35l1.42-1.42'],
  bell: ['M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9','M10 21h4'],
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4','M16 17l5-5-5-5','M21 12H9'],
  menu: ['M4 6h16','M4 12h16','M4 18h16'],
  close: ['M18 6 6 18','M6 6l12 12'],
  chevron: ['M6 9l6 6 6-6'],
  check: ['M20 6 9 17l-5-5'],
  'check-circle': ['M12 22a10 10 0 1 0 0-20a10 10 0 0 0 0 20','M8 12l3 3 5-6'],
  'alert-circle': ['M12 22a10 10 0 1 0 0-20a10 10 0 0 0 0 20','M12 7v6','M12 17h.01'],
  'alert-triangle': ['M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z','M12 9v4','M12 17h.01'],
  info: ['M12 22a10 10 0 1 0 0-20a10 10 0 0 0 0 20','M12 11v6','M12 7h.01'],
  plus: ['M12 5v14','M5 12h14'],
  edit: ['M12 20h9','M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4L16.5 3.5z'],
  trash: ['M3 6h18','M8 6V4h8v2','M5 6l1 15h12l1-15','M10 10v7','M14 10v7'],
  eye: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z','M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6'],
  search: ['M11 19a8 8 0 1 0 0-16a8 8 0 0 0 0 16','M21 21l-4.4-4.4'],
  upload: ['M12 16V3','M7 8l5-5 5 5','M4 16v4h16v-4'],
  download: ['M12 3v13','M7 11l5 5 5-5','M4 18v3h16v-3'],
  refresh: ['M20 7v5h-5','M4 17v-5h5','M5.5 9a7 7 0 0 1 12-2L20 12','M4 12l2.5 5a7 7 0 0 0 12-2'],
  save: ['M4 3h13l4 4v14H3V3z','M7 3v6h10V3','M7 21v-8h10v8'],
  arrow: ['M5 12h14','M12 5l7 7-7 7'],
  'arrow-left': ['M19 12H5','M12 19l-7-7 7-7'],
  mail: ['M3 5h18v14H3z','M3 7l9 7 9-7'],
  filter: ['M3 5h18l-7 8v6l-4 2v-8z'],
  home: ['M3 10 12 3l9 7','M5 9v12h14V9','M9 21v-7h6v7'],
};

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `<svg class="app-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path *ngFor="let part of paths" [attr.d]="part" /></svg>`,
})
export class IconComponent {
  private iconName = 'info';
  @Input() set name(name: string) { this.iconName = name; }
  get paths(): string[] { return ICONS[this.iconName] || ICONS['info']; }
}
