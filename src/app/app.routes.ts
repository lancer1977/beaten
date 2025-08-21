import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import your components
import { HomeComponent } from './home/home.component';
import { WallyComponent } from './component/wally/beatengames.component';

// Define your routes
export const routes: Routes = [
  { path: '', component: HomeComponent },
{path:'segafan001',component: WallyComponent}
  // You can add more routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
