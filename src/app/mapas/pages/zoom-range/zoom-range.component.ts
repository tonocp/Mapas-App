import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }
      .row {
        background-color: white;
        border-radius: 5px;
        position: fixed;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        z-index: 999;
        width: 400 px;
      }
    `,
  ],
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 13;
  center: [number, number] = [-2.449367885665748, 42.46967419248548];

  constructor() {}
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });
    // Listener para el zoom
    this.mapa.on('zoom', (event) => {
      const zoomActual = this.mapa.getZoom();
      this.zoomLevel = zoomActual;
    });
    // Listener para controlar el tope de zoom
    this.mapa.on('zoomend', (event) => {
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      }
    });
    // Listener para obtener coordenadas del centro del movimiento del mapa
    this.mapa.on('move', (event) => {
      const { lng, lat } = event.target.getCenter();
      this.center = [lng, lat];
    });
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomRangeLevel(zoom: string) {
    this.mapa.zoomTo(Number(zoom));
  }
}
