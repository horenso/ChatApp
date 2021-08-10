import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableMeta } from 'src/app/model/table-meta';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.sass'],
})
export class RoomFormComponent implements OnInit {
  tableForm: FormGroup;

  @Output() submit = new EventEmitter<TableMeta>();

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
      password: [null, [Validators.minLength(5), Validators.maxLength(20)]],
    });
  }

  ngOnInit(): void {}

  submitForm(): void {
    this.submit.emit({
      name: this.tableForm.value.name,
      password: this.tableForm.value.password,
    });
  }
}
