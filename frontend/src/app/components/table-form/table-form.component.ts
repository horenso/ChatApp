import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableMeta } from 'src/app/model/table-meta';

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.sass'],
})
export class TableFormComponent implements OnInit {
  tableForm: FormGroup;

  @Output() onSubmit = new EventEmitter<TableMeta>();

  constructor(private formBuilder: FormBuilder) {
    this.tableForm = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      password: [null, [Validators.maxLength(20)]],
    });
  }

  ngOnInit(): void {}

  submitForm(): void {
    this.onSubmit.emit({
      name: this.tableForm.value.name,
      password: this.tableForm.value.password,
    });
  }
}
