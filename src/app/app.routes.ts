import { Routes, RouterModule } from '@angular/router';
import { BarcodeScannerComponent } from './components/barcode-scanner/barcode-scanner.component';

export const routes: Routes = [
  { path: '', redirectTo: 'scanner', pathMatch: 'full' },
  { path: 'scanner', component: BarcodeScannerComponent }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
