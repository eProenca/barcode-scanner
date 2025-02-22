import { Component } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { CommonModule } from '@angular/common';
import { PoPageModule, PoButtonModule, PoListViewModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule, PoPageModule, PoButtonModule, PoListViewModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent {
  scanner: BrowserMultiFormatReader;
  scannedCodes: { code: string, time: string }[] = [];
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
          if (now - this.lastScanned >= 3000) { // Delay de 3 segundos entre leituras
            const scannedItem = {
              code: result.getText(),
              time: new Date().toLocaleTimeString()
            };
            this.scannedCodes.push(scannedItem);
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
