import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {Instance, ApiService, FileInfo, Revision} from '../../api.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FileEditDialogComponent} from '../file-edit-dialog/file-edit-dialog.component';
import {RevisionEditDialogComponent} from '../revision-edit-dialog/revision-edit-dialog.component';

const ERROR_SNACK_ACTION = 'OK';
const ERROR_SNACK_CONFIG = {
  duration: 5000
};

interface InstanceDialogData {
  instance: Instance;
  list: Instance[];
}

@Component({
  selector: 'app-instance-edit-dialog',
  templateUrl: './instance-edit-dialog.component.html',
  styleUrls: ['./instance-edit-dialog.component.sass']
})
export class InstanceEditDialogComponent {

  private edited = false;
  private instanceForm = new FormGroup({
    name: new FormControl(this.data.instance.name, [
      Validators.required,
      Validators.pattern('[a-zA-Z0-9\-_]+')
    ]),
    port: new FormControl(this.data.instance.port || 13353, [
      Validators.required,
      Validators.pattern('[0-9]+'),
      portIsUnique(this.data.list)
    ]),
    revision: new FormControl(null, [
      Validators.required,
    ]),
    lang: new FormControl(this.data.instance.lang || 'en', [
      Validators.required,
      Validators.pattern('[a-z]{2}')
    ]),
    debug: new FormControl(this.data.instance.debug || 2, [
      Validators.required,
      Validators.min(0),
      Validators.max(3)
    ]),
    pak: new FormControl(null, [
      Validators.required
    ]),
    savegame: new FormControl(null, [
      Validators.required
    ]),
    url: new FormControl(this.data.instance.url)
  });

  revisions: Revision[];
  paks: FileInfo[];
  saves: FileInfo[];

  constructor(public dialogRef: MatDialogRef<InstanceEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: InstanceDialogData,
              private _apiService: ApiService,
              private _confirmDialog: MatDialog,
              private _createRevisionDialog: MatDialog,
              private _createPakDialog: MatDialog,
              private _createSaveDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
    if (this.data.instance.revision != null) {
      this.instanceForm.patchValue({
        revision: (this.data.instance.revision as Revision).url
      });
    }

    if (this.data.instance.pak != null) {
      this.instanceForm.patchValue({
        pak: (this.data.instance.pak as FileInfo).url
      });
    }

    if (this.data.instance.savegame != null) {
      this.instanceForm.patchValue({
        savegame: (this.data.instance.savegame as FileInfo).url
      });
    }

    this.instanceForm.valueChanges.subscribe(() => {
      this.edited = true;
      this.dialogRef.disableClose = true;
    });

    this.revisionsList();
    this.paksList();
    this.savesList();
  }

  private revisionsList() {
    this._apiService.revisionsList().subscribe(revisions => this.revisions = revisions);
  }

  private paksList() {
    this._apiService.paksList().subscribe(paks => this.paks = paks);
  }

  private savesList() {
    this._apiService.savesList().subscribe(saves => this.saves = saves);
  }

  /**
   * Check for edits and close the dialog
   */
  closeConfirm(prompt: string) {
    if (this.edited) {
      // If the content has been edited, open a confirm dialog before closing
      const confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {
        data: prompt,
      });
      confirmDialogRef.afterClosed().subscribe((answer) => {
        if (answer) {
          this.dialogRef.close();
        }
      });
    } else {
      // If not edit has been made, just close the dialog
      this.dialogRef.close();
    }
  }

  createRevisionDialog() {
    const createRevisionDialog = this._createRevisionDialog.open(RevisionEditDialogComponent, {
      data: {revision: {} as Revision, list: this.revisions}
    });
    createRevisionDialog.afterClosed().subscribe(data => {
      if (data != null) {
        this._apiService.revisionsPost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.revisionsList()
        });
      }
    });
  }

  createPakDialog() {
    const createPakDialogRef = this._createPakDialog.open(FileEditDialogComponent, {
      data: {file: {} as FileInfo, list: this.paks}
    });
    createPakDialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this._apiService.pakPost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.paksList()
        });
      }
    });
  }

  createSaveDialog() {
    const createSaveDialogRef = this._createSaveDialog.open(FileEditDialogComponent, {
      data: {file: {} as FileInfo, list: this.saves},
    });
    createSaveDialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this._apiService.savePost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.savesList()
        });
      }
    });
  }

  save() {
    this.dialogRef.close(this.instanceForm.value);
  }
}

function portIsUnique(instances: Instance[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    for (const instance of instances) {
      if (instance.port === control.value) {
        return {portNotUnique: {value: control.value}};
      }
    }
    return null;
  };
}
