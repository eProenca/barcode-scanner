import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoPageModule, PoButtonModule, PoListViewModule, PoFieldModule, PoModule } from '@po-ui/ng-components';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';


@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule, PoPageModule, PoButtonModule, PoListViewModule, PoFieldModule, PoModule, ZXingScannerModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})

export class BarcodeScannerComponent implements OnDestroy {
  scannedQueue: { code: string, time: string }[] = [];
  detailedCodes: { code: string, time: string }[] = [];
  isScanning: boolean = false;
  totalScanned: number = 0;
  totalAdded: number = 0;
  isProcessing: boolean = false;
  scannedCode: string = '';
  scannedCodes: { code: string; format: string; timestamp: string }[] = [];
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.EAN_13];

  startScan() {
    this.isScanning = true;
  }

  stopScan() {
    this.isScanning = false;
  }

  onCodeResult(result: string) {
    if (result) {
      const scannedItem = {
        code: result,
        format: 'Desconhecido',
        timestamp: new Date().toLocaleString()
      };
  
      this.scannedCodes = [...this.scannedCodes, scannedItem]; // Criando nova referência para detecção de mudança
      this.playBeep();
  
      setTimeout(() => {}, 5000);
    }
  }
  

  playBeep() {
    const audio = new Audio('assets/sounds/beep2.mp3');
    audio.play().catch(error => console.error('Erro ao reproduzir o som:', error));
  }

  async processScannedCodes() {
    while (this.isScanning || this.scannedQueue.length > 0) {
      if (this.scannedQueue.length > 0) {
        const item = this.scannedQueue.shift();
        if (item) {
          this.detailedCodes.push(item);
          this.totalAdded++;
          await this.delay(3000);
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

// import { Component, OnDestroy } from '@angular/core';
// import { BrowserMultiFormatReader } from '@zxing/browser';
// import { CommonModule } from '@angular/common';
// import { PoPageModule, PoButtonModule, PoListViewModule, PoFieldModule, PoModule } from '@po-ui/ng-components';
// import Quagga from '@ericblade/quagga2';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';

// @Component({
//   selector: 'app-barcode-scanner',
//   standalone: true,
//   imports: [CommonModule, PoPageModule, PoButtonModule, PoListViewModule, PoFieldModule, PoModule, ZXingScannerModule],
//   templateUrl: './barcode-scanner.component.html',
//   styleUrls: ['./barcode-scanner.component.scss']
// })
// export class BarcodeScannerComponent implements OnDestroy {
//   scanner: BrowserMultiFormatReader;
//   scannedQueue: { code: string, time: string }[] = [];
//   detailedCodes: { code: string, time: string }[] = [];
//   isScanning: boolean = false;
//   totalScanned: number = 0;
//   totalAdded: number = 0;
//   isProcessing: boolean = false;
//   videoStream: MediaStream | null = null;
//   scannedCode: string = '';
//   keydownListener: any;

//   constructor() {
//     this.scanner = new BrowserMultiFormatReader();
//   }

//   async startScan() {
//     this.isScanning = true;

//     try {
//       const videoElement = document.getElementById('videoElement') as HTMLVideoElement;
//       this.videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

//       if (videoElement) {
//         videoElement.srcObject = this.videoStream;
//         videoElement.style.display = 'block';
//       }

//       this.scanner.decodeFromVideoDevice(undefined, 'videoElement', (result, error, controls) => {
//         if (result) {
//           const code = result.getText();
//           const now = new Date().toLocaleTimeString();
//           this.scannedQueue.push({ code, time: now });
//           this.totalScanned++;

//           this.playBeep();
//         }
//       });

//       if (!this.isProcessing) {
//         this.isProcessing = true;
//         this.processScannedCodes();
//       }
//     } catch (err) {
//       console.error('Erro ao acessar a câmera:', err);
//     }
//   }

//   async startReader() {
//     this.isScanning = true;
//     this.scannedCode = '';

//     if (this.keydownListener) {
//       window.removeEventListener('keydown', this.keydownListener);
//     }

//     this.keydownListener = (event: KeyboardEvent) => {
//       if (!this.isScanning) return;

//       if (event.key === 'Enter' || event.key === 'Tab') {
//         event.preventDefault();
//         if (this.scannedCode) {
//           const now = new Date().toLocaleTimeString();
//           this.scannedQueue.push({ code: this.scannedCode, time: now });
//           this.totalScanned++;
//           this.scannedCode = '';
//         }
//       } else {
//         this.scannedCode += event.key;
//       }

//       if (!this.isProcessing) {
//         this.isProcessing = true;
//         this.processScannedCodes();
//       }
//     };

//     window.addEventListener('keydown', this.keydownListener);
//   }

//   startUrovoReader() {
//     this.isScanning = true;
//     const urovoInput = document.getElementById('urovoInput') as HTMLInputElement;
  
//     urovoInput.value = '';
//     urovoInput.focus();
  
//     urovoInput.addEventListener('keydown', (event) => {
//       if (event.key === 'Enter' || event.key === 'Tab') {
//         event.preventDefault();
//         const scannedCode = urovoInput.value.trim();
        
//         if (scannedCode) {
//           const now = new Date().toLocaleTimeString();
//           this.scannedQueue.push({ code: scannedCode, time: now });
//           this.totalScanned++;
//           urovoInput.value = '';

//           this.playBeep();
//         }

//         if (!this.isProcessing) {
//           this.isProcessing = true;
//           this.processScannedCodes();
//         }
//       }
//     });
//   }
  
//   playBeep() {
//     const audio = new Audio('sounds/beep2.mp3');
//     audio.play().catch(error => console.error('Erro ao reproduzir o som:', error));
//   }
  
//   stopScan() {
//     this.isScanning = false;

//     if (this.videoStream) {
//       this.videoStream.getTracks().forEach(track => track.stop());
//       this.videoStream = null;
//     }

//     const videoElement = document.getElementById('videoElement') as HTMLVideoElement;
//     if (videoElement) {
//       videoElement.style.display = 'none';
//       videoElement.srcObject = null;
//     }

//     if (this.keydownListener) {
//       window.removeEventListener('keydown', this.keydownListener);
//     }
//   }

//   async processScannedCodes() {
//     while (this.isScanning || this.scannedQueue.length > 0) {
//       if (this.scannedQueue.length > 0) {
//         const item = this.scannedQueue.shift();
//         if (item) {
//           this.detailedCodes.push(item);
//           this.totalAdded++;
//           await this.delay(3000);
//         }
//       } else {
//         await this.delay(500);
//       }
//     }
//     this.isProcessing = false;
//   }

//   delay(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   ngOnDestroy() {
//     this.stopScan();
//     this.stopQuagga();
//   }

//   initQuagga() {
//     this.isScanning = true;
//     Quagga.init({
//       inputStream: {
//         name: "Live",
//         type: "LiveStream",
//         target: document.querySelector('#scanner-container') || undefined
//       },
//       decoder: {
//         readers: ["code_128_reader"] // Tipos de código de barras suportados
//       },
//       locate: true, // ✅ Habilita a localização do código com borda vermelha
//       locator: {
//         halfSample: true,
//         patchSize: "x-large", // Pode ser 'x-small', 'small', 'medium', 'large', 'x-large'      
//       },
//     }, (err) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       Quagga.start();
//     });
  
//     Quagga.onDetected((data) => {
//       console.log("Código detectado:", data.codeResult.code);
//     });

//     Quagga.onProcessed((result) => {
//       const drawingCanvas = document.querySelector(".drawingBuffer") as HTMLCanvasElement;
//       if (!drawingCanvas || !result) return;
    
//       const ctx = drawingCanvas.getContext("2d");
//       if (!ctx) return;
    
//       ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); // Limpa o canvas antes de desenhar
    
//       if (result.boxes) {
//         console.log("Detectando bordas...", result.boxes);
    
//         ctx.strokeStyle = "red"; // Cor da borda
//         ctx.lineWidth = 2;
//         result.boxes.forEach((box) => {
//           ctx.beginPath();
//           ctx.moveTo(box[0][0], box[0][1]); // Ponto 1
//           ctx.lineTo(box[1][0], box[1][1]); // Ponto 2
//           ctx.lineTo(box[2][0], box[2][1]); // Ponto 3
//           ctx.lineTo(box[3][0], box[3][1]); // Ponto 4    
//           ctx.closePath();
//           ctx.stroke();
//         });
//       }
//     });
    
//   }
  
//   stopQuagga() {
//     Quagga.stop();
//     Quagga.offDetected(); // Remove o evento para evitar duplicação
//   }
// }