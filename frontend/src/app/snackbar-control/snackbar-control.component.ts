import { Component, OnInit ,Inject} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-snackbar-control',
  templateUrl: './snackbar-control.component.html',
  styleUrls: ['./snackbar-control.component.scss']
})
export class SnackbarControlComponent implements OnInit {




  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

}
