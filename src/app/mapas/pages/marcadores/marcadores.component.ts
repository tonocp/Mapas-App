import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface customMarker {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }
      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999;
      }
      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-2.448509578984624, 42.46948425708935];
  marcadores: customMarker[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });

    this.leerMarcadores();
  }

  agregarMarker() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color: color,
    })
      .setLngLat(this.center)
      .addTo(this.mapa);
    this.marcadores.push({
      color,
      marker: newMarker,
    });
    this.guardarMarcadores();
    newMarker.on('dragend', (_) => {
      this.guardarMarcadores();
    });
  }

  goToMarker(marcador: customMarker) {
    this.mapa.flyTo({
      center: marcador.marker!.getLngLat(),
    });
  }

  guardarMarcadores() {
    const lngLatArray: customMarker[] = [];

    this.marcadores.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      lngLatArray.push({
        color: color,
        center: [lng, lat],
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArray));
  }

  leerMarcadores() {
    if (!localStorage.getItem('marcadores')) return;
    const lngLatArray: customMarker[] = JSON.parse(
      localStorage.getItem('marcadores')!
    );
    lngLatArray.forEach((m) => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.center!)
        .addTo(this.mapa);
      this.marcadores.push({
        marker: newMarker,
        color: m.color,
      });
      newMarker.on('dragend', (_) => {
        this.guardarMarcadores();
      });
    });
  }

  borrarMarker(i: number) {
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadores();
  }
}
