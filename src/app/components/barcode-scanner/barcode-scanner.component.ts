import { Component, OnDestroy } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { CommonModule } from '@angular/common';
import { PoPageModule, PoButtonModule, PoListViewModule, PoFieldModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule, PoPageModule, PoButtonModule, PoListViewModule, PoFieldModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnDestroy {
  scanner: BrowserMultiFormatReader;
  scannedQueue: { code: string, time: string }[] = [];
  detailedCodes: { code: string, time: string }[] = [];
  isScanning: boolean = false;
  totalScanned: number = 0;
  totalAdded: number = 0;
  isProcessing: boolean = false;
  videoStream: MediaStream | null = null;
  scannedCode: string = '';
  keydownListener: any;

  constructor() {
    this.scanner = new BrowserMultiFormatReader();
  }

  async startScan() {
    this.isScanning = true;

    try {
      const videoElement = document.getElementById('videoElement') as HTMLVideoElement;
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

      if (videoElement) {
        videoElement.srcObject = this.videoStream;
        videoElement.style.display = 'block';
      }

      this.scanner.decodeFromVideoDevice(undefined, 'videoElement', (result, error, controls) => {
        if (result) {
          const code = result.getText();
          const now = new Date().toLocaleTimeString();
          this.scannedQueue.push({ code, time: now });
          this.totalScanned++;
        }
      });

      if (!this.isProcessing) {
        this.isProcessing = true;
        this.processScannedCodes();
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
    }
  }

  async startReader() {
    this.isScanning = true;
    this.scannedCode = '';

    if (this.keydownListener) {
      window.removeEventListener('keydown', this.keydownListener);
    }

    this.keydownListener = (event: KeyboardEvent) => {
      if (!this.isScanning) return;

      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        if (this.scannedCode) {
          const now = new Date().toLocaleTimeString();
          this.scannedQueue.push({ code: this.scannedCode, time: now });
          this.totalScanned++;
          this.scannedCode = ''; // Limpa o buffer
        }
      } else {
        this.scannedCode += event.key;
      }

      if (!this.isProcessing) {
        this.isProcessing = true;
        this.processScannedCodes();
      }
    };

    window.addEventListener('keydown', this.keydownListener);
  }

  async startUrovoReader() {
    this.isScanning = true;
    let scannedCode = '';
  
    document.addEventListener('urovo.scan', (event: any) => {
      if (!this.isScanning) return;
  
      const barcodeData = event.detail?.data || '';
      if (barcodeData) {
        const now = new Date().toLocaleTimeString();
        this.scannedQueue.push({ code: barcodeData, time: now });
        this.totalScanned++;
      }
  
      if (!this.isProcessing) {
        this.isProcessing = true;
        this.processScannedCodes();
      }
    });
  }
  

  stopScan() {
    this.isScanning = false;

    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }

    const videoElement = document.getElementById('videoElement') as HTMLVideoElement;
    if (videoElement) {
      videoElement.style.display = 'none';
      videoElement.srcObject = null;
    }

    if (this.keydownListener) {
      window.removeEventListener('keydown', this.keydownListener);
    }
  }

  async processScannedCodes() {
    while (this.isScanning || this.scannedQueue.length > 0) {
      if (this.scannedQueue.length > 0) {
        const item = this.scannedQueue.shift();
        if (item) {
          this.detailedCodes.push(item);
          this.totalAdded++;
          await this.delay(5000);
        }
      } else {
        await this.delay(500);
      }
    }
    this.isProcessing = false;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnDestroy() {
    this.stopScan();
  }
}
