import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  brand: string;
  model: string;
  image?: string;
  weight?: string;
  dimensions?: {
    width: string;
    height: string;
    depth: string;
  };
  energyConsumption?: string;
  otherSpecs?: string;
}

export interface Incidence {
  id: number;
  productId: number;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'resolved';
  createdAt: Date;
  createdBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Lavadora LG',
      brand: 'LG',
      model: 'F4WV3008S6W',
      image: 'assets/images/logo-naranja.png',
      weight: '65 kg',
      dimensions: {
        width: '60 cm',
        height: '85 cm',
        depth: '56 cm'
      },
      energyConsumption: '152 kWh/año',
      otherSpecs: 'Capacidad 8kg, 1400 rpm, Motor Inverter Direct Drive'
    },
    {
      id: 2,
      name: 'Aspiradora LG',
      brand: 'LG',
      model: 'A9K-ULTRA1B',
      image: 'assets/images/logo-naranja.png',
      weight: '2.7 kg',
      dimensions: {
        width: '27 cm',
        height: '110 cm',
        depth: '25 cm'
      },
      energyConsumption: '400 W',
      otherSpecs: 'Inalámbrica, Autonomía 80 min, Tecnología Power Drive Mop'
    },
    {
      id: 3,
      name: 'Frigorífico Samsung',
      brand: 'Samsung',
      model: 'RB38T675DSA',
      image: 'assets/images/logo-naranja.png',
      weight: '70 kg',
      dimensions: {
        width: '59.5 cm',
        height: '203 cm',
        depth: '65.8 cm'
      },
      energyConsumption: '220 kWh/año',
      otherSpecs: 'Capacidad 390L, No Frost, SpaceMax Technology'
    }
  ];

  private incidences: Incidence[] = [
    {
      id: 1,
      productId: 1,
      title: 'La lavadora no centrifuga correctamente',
      description: 'Al poner el programa de centrifugado, la lavadora hace ruidos extraños y no alcanza la velocidad indicada.',
      category: 'functionality',
      severity: 'high',
      status: 'pending',
      createdAt: new Date('2026-01-10'),
      createdBy: 'usuario123'
    },
    {
      id: 2,
      productId: 1,
      title: 'Error E3 en pantalla',
      description: 'Aparece el código de error E3 después de 10 minutos de lavado.',
      category: 'functionality',
      severity: 'medium',
      status: 'resolved',
      createdAt: new Date('2026-01-08'),
      createdBy: 'maria_tech'
    },
    {
      id: 3,
      productId: 1,
      title: 'Puerta no cierra bien',
      description: 'La puerta de la lavadora no cierra correctamente, hay que hacer fuerza.',
      category: 'appearance',
      severity: 'low',
      status: 'pending',
      createdAt: new Date('2026-01-12'),
      createdBy: 'pepe_repair'
    },
    {
      id: 4,
      productId: 2,
      title: 'Batería se descarga rápido',
      description: 'La batería dura menos de 30 minutos cuando debería durar 80.',
      category: 'performance',
      severity: 'high',
      status: 'pending',
      createdAt: new Date('2026-01-11'),
      createdBy: 'carlos_fix'
    }
  ];

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() { }

  /**
   * Obtiene todos los productos
   */
  getProducts(): Observable<Product[]> {
    this.loadingSubject.next(true);
    return of(this.products).pipe(
      delay(500),
      map(products => {
        this.loadingSubject.next(false);
        return products;
      })
    );
  }

  /**
   * Obtiene un producto por su ID
   */
  getProductById(id: number): Observable<Product | undefined> {
    this.loadingSubject.next(true);
    return of(this.products.find(p => p.id === id)).pipe(
      delay(800),
      map(product => {
        this.loadingSubject.next(false);
        return product;
      })
    );
  }

  /**
   * Busca productos por término
   */
  searchProducts(term: string): Observable<Product[]> {
    this.loadingSubject.next(true);
    const lowerTerm = term.toLowerCase();
    const results = this.products.filter(p =>
      p.name.toLowerCase().includes(lowerTerm) ||
      p.brand.toLowerCase().includes(lowerTerm) ||
      p.model.toLowerCase().includes(lowerTerm)
    );
    return of(results).pipe(
      delay(500),
      map(products => {
        this.loadingSubject.next(false);
        return products;
      })
    );
  }

  /**
   * Añade un nuevo producto
   */
  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: Math.max(...this.products.map(p => p.id)) + 1
    };
    this.products.push(newProduct);
    return of(newProduct).pipe(delay(500));
  }

  /**
   * Obtiene las incidencias de un producto
   */
  getIncidencesByProductId(productId: number): Observable<Incidence[]> {
    return of(this.incidences.filter(i => i.productId === productId)).pipe(delay(300));
  }

  /**
   * Añade una nueva incidencia
   */
  addIncidence(incidence: Omit<Incidence, 'id' | 'createdAt'>): Observable<Incidence> {
    const newIncidence: Incidence = {
      ...incidence,
      id: Math.max(...this.incidences.map(i => i.id)) + 1,
      createdAt: new Date()
    };
    this.incidences.push(newIncidence);
    return of(newIncidence).pipe(delay(500));
  }

  /**
   * Filtra incidencias por estado
   */
  filterIncidences(productId: number, status?: 'pending' | 'resolved'): Observable<Incidence[]> {
    let filtered = this.incidences.filter(i => i.productId === productId);
    if (status) {
      filtered = filtered.filter(i => i.status === status);
    }
    return of(filtered).pipe(delay(300));
  }

  /**
   * Busca incidencias por término
   */
  searchIncidences(productId: number, term: string, status?: 'pending' | 'resolved'): Observable<Incidence[]> {
    const lowerTerm = term.toLowerCase();
    let filtered = this.incidences.filter(i =>
      i.productId === productId &&
      (i.title.toLowerCase().includes(lowerTerm) ||
       i.description.toLowerCase().includes(lowerTerm))
    );
    if (status) {
      filtered = filtered.filter(i => i.status === status);
    }
    return of(filtered).pipe(delay(300));
  }
}

