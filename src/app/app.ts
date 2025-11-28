import {Component, signal} from '@angular/core';
import {TestComponent} from './components/page/test/test.component';

@Component({
  selector: 'app-root',
  imports: [TestComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mj-front');
}
