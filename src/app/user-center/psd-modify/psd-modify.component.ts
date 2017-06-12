import {Component , OnInit} from '@angular/core';


import {YslHttpService} from "../../core/ysl-http.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'psd-modify',
  templateUrl: './psd-modify.component.html',
  styleUrls: ['../user-center.component.css']
})

export class PsdModifyComponent implements OnInit{

  modifyForm: FormGroup;
  isSubmit = false;
  formError = {
    newPass: '',
    confirmPass: ''
  };
  formErrorMess = {
    newPass: {
      required: '新密码不能为空',
      pattern: '密码格式不正确',
      minlength: '密码长度不能小于6',
      maxlength: '密码长度不得超过12'
    },
    confirmPass: {
      required: '密码不能为空'
    },
    oldPass: {}
  }
  constructor(private httpService: YslHttpService, private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  // 修改密码
  modifySubmit() {
    if (!this.modifyForm) { return }
    this.isSubmit = true;
    const form = this.modifyForm;
    console.log('form', form)
    for (const field in this.formError) {
      this.formError[field] = '';
      const control = form.controls[field]
      if (control && control.errors && !control.valid) {
        const mess = this.formErrorMess[field];
        for (const err in control.errors) {
          this.formError[field] += mess[err] + '';
        }
      }
    }
    // this.httpService.updatePass({userId: 87})
    //   .then(res => {
    //     console.log('修改成功', this.modifyForm.value)
    //   })
  }
  // 创建表单
  createForm() {
    this.modifyForm = this.fb.group({
      oldPass: [''],
      newPass: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z][a-zA-Z0-9_]*$'),
        Validators.minLength(6),
        Validators.maxLength(12)
      ])],
      confirmPass: ['', Validators.required]
    })
  }
}
