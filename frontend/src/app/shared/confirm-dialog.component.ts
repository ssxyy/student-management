import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({ selector: 'app-confirm-dialog', standalone: true, template: `<div class="overlay" role="presentation"><section class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">Confirm deletion</h2><p>{{message}}</p><div class="actions"><button type="button" class="secondary" (click)="cancel.emit()">Cancel</button><button type="button" class="danger" (click)="confirm.emit()">Delete</button></div></section></div>` })
export class ConfirmDialogComponent {
    @Input()
    message = 'Are you sure?';
    @Output()
    cancel = new EventEmitter<void>();
    @Output()
    confirm = new EventEmitter<void>();
}

