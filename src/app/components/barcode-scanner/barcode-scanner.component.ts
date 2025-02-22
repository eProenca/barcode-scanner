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
  scannedQueue: { code: string, time: string }[] = [];
  detailedCodes: { code: string, time: string }[] = [];
  isScanning: boolean = false;
  totalScanned: number = 0;
  totalAdded: number = 0;
  isProcessing: boolean = false;
  videoStream: MediaStream | null = null;

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

  stopScan() {
    this.isScanning = false;

    // Desativar a câmera
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }

    // Ocultar o vídeo
    const videoElement = document.getElementById('videoElement') as HTMLVideoElement;
    if (videoElement) {
      videoElement.style.display = 'none';
      videoElement.srcObject = null; // Limpa a referência para liberar a câmera
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
}
