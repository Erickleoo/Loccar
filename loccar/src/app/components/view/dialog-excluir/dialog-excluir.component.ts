import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-excluir',
  templateUrl: './dialog-excluir.component.html',
  styleUrls: ['./dialog-excluir.component.css']
})
export class DialogExcluirComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogExcluirComponent>, @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
  }

  confirmcaoExcluir() {
    this.dialogRef.close(true)
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
