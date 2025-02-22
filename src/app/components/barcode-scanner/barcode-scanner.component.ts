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
  scannedQueue: { code: string, time: string }[] = []; // Fila de códigos escaneados
  detailedCodes: { code: string, time: string }[] = []; // Lista de detalhes exibidos
  isScanning: boolean = false;
  totalScanned: number = 0;
  isProcessing: boolean = false;

  constructor() {
    this.scanner = new BrowserMultiFormatReader();
  }

  startScan() {
    this.isScanning = true;
    this.scanner
      .decodeFromVideoDevice(undefined, 'videoElement', (result) => {
        if (result?.getText) {
          const code = result.getText();
          const now = new Date().toLocaleTimeString();

          // Apenas adiciona à fila, sem bloquear o scanner
          this.scannedQueue.push({ code, time: now });
          this.totalScanned++;
        }
      })
      .catch(err => console.error(err));

    // Inicia o processamento assíncrono dos detalhes
    if (!this.isProcessing) {
      this.isProcessing = true;
      this.processScannedCodes();
    }
  }

  stopScan() {
    this.isScanning = false;
  }

  async processScannedCodes() {
    while (this.isScanning || this.scannedQueue.length > 0) {
      if (this.scannedQueue.length > 0) {
        const item = this.scannedQueue.shift(); // Pega o primeiro item da fila
        if (item) {
          this.detailedCodes.push(item);
          await this.delay(5000); // Delay antes de processar o próximo
        }
      } else {
        await this.delay(500); // Pequeno delay para evitar loop excessivo
      }
    }
    this.isProcessing = false;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
