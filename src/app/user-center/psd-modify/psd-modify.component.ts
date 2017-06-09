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
  formError = {
    newPass: '',
    confirmPass: ''
  };
  formErrorMess = {
    newPass: {
      required: '新密码不能为空',
      pattern: '密码格式不正确'
    },
    confirmPass: {
      require: '密码不能为空'
    }
  }
  constructor(private httpService: YslHttpService, private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  // 修改密码
  modifySubmit() {
    if (!this.modifyForm) { return }
    const form = this.modifyForm;
    // this.httpService.updatePass({userId: 87})
    //   .then(res => {
    //     console.log('修改成功', this.modifyForm.value)
    //   })
  }
  // 创建表单
  createForm() {
    this.modifyForm = this.fb.group({
      oldPass: [''],
      newPass: ['', Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9_]*$')],
      confirmPass: ['', Validators.required]
    })
  }
}
