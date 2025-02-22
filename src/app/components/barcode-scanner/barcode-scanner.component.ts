import { Component } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { CommonModule } from '@angular/common';

// Importando os módulos necessários do PO UI
import { PoPageModule, PoButtonModule, PoListViewModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true, // Define o componente como independente
  imports: [CommonModule, PoPageModule, PoButtonModule, PoListViewModule], // Importa os módulos do PO UI
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent {
  scanner: BrowserMultiFormatReader;
  scannedCodes: string[] = [];
  isScanning: boolean = false;
  lastScanned: number = 0;

  constructor() {
    this.scanner = new BrowserMultiFormatReader();
  }

  startScan() {
    this.isScanning = true;
    this.scanner
      .decodeFromVideoDevice(undefined, 'videoElement', (result) => {
        if (result?.getText) {
          const now = Date.now();
          if (now - this.lastScanned >= 5000) {
            this.scannedCodes.push(result.getText());
            this.lastScanned = now;
          }
        }
      })
      .catch(err => console.error(err));
  }

  stopScan() {
    this.isScanning = false;
  }
}
