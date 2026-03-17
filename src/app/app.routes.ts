import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import your components
import { HomeComponent } from './home/home.component';
import { GamesBeatenComponent } from './component/wally/beatengames.component';
import { SheetsSettingsComponent } from './component/sheets-settings/sheets-settings.component';

// Define your routes
// Note: Static routes must come before dynamic routes like :streamerName
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SheetsSettingsComponent },
  { path: ':streamerName', component: GamesBeatenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
