import { Component, OnInit } from '@angular/core';
import { Logger } from '../../shared/logging/logger';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss',
})
export class AuthCallbackComponent implements OnInit {
  readonly #logger = new Logger('callback.component');
  ngOnInit(): void {
    this.#logger.debug('ngOnInit');
  }
}
