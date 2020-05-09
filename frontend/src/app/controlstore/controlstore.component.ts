import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    NgZone,
    ElementRef
} from '@angular/core';
import {
    finalize
} from 'rxjs/operators';
import {
    combineLatest,
    of
} from 'rxjs';
import {
    WizardComponent
} from 'angular-archwizard';
import {
    ControlStoreService
} from './controlstore.service';
import {
    SelectDropDownModule
} from 'ngx-select-dropdown';
import {
    IDropdownSettings
} from 'ng-multiselect-dropdown';
import {
    NgbDateStruct,
    NgbCalendar,
    NgbDate
} from '@ng-bootstrap/ng-bootstrap';
import {
    NgbModal,
    ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    MatTableDataSource
} from '@angular/material/table';
import {
    MatSort
} from '@angular/material/sort';
import {
    Sort
} from '@angular/material/sort';
import {
    MatCheckboxModule
} from '@angular/material/checkbox';
import {
    SelectionModel
} from '@angular/cdk/collections';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import {
    map
} from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import {
    ToastrService
} from 'ngx-toastr';
import {
    NestedTreeControl
} from '@angular/cdk/tree';
import {
    MatTreeNestedDataSource
} from '@angular/material/tree';
import {
    MatSnackBar
} from '@angular/material/snack-bar';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';
import {
    Angular5Csv
} from 'angular5-csv/dist/Angular5-csv';
// import * as data from 'D:/TCAT/frontend/src/feature.json';
import HC_exporting from 'highcharts/modules/exporting';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {SnackbarControlComponent} from '../snackbar-control/snackbar-control.component'

import { environment} from '../../environments/environment'

HC_exporting(Highcharts);
import * as moment from 'moment';
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
declare var $: any;

export interface AdvSettingvalues {
    TestStore: any;
    // State:any;
    // StoreType:any;
    // Locality:any;
}
export interface Matchresultvalues {
    TestStore: any;
    Controlstore: Array < string > ;
    Similarval: Array < string > ;
    Salescorrelation: Array < string > ;
}
export interface Stat_Result_Data {
    VariableName: any;
    PValue: any;
    //State:any;
}

interface ConsideredFeatVals {
    name: string;
    children ? : ConsideredFeatVals[];
}

interface SelectItem {
    prdid: number;
    prdtext: string;
}

interface Productlist {
    item_id: number;
    item_text: string;
}

@Component({
    selector: 'app-controlstore',
    templateUrl: './controlstore.component.html',
    styleUrls: ['./controlstore.component.scss']
})
export class ControlStoreComponent implements OnInit {
    quote: string;
    no_of_cntrl: any;
    n_control_required: boolean = false;
    isLoading: boolean;
    isShow: boolean = false;
    size = 10;
    match_vals_size = 10;
    stat_vals_size = 10;
    showcnt1: boolean = true;
    showcnt2: boolean = false;
    showcnt3: boolean = false;
    Excluecontrolstore: any = [];
    key: any;
    numberval: any = 1;
    featurevalue: any = '';
    file_exclude: any = '';
    submit_visible: boolean = true;
    submitcntrl_visible: boolean = true;
    pageIndex = 0;
	productcount:any;
	categorycount:any;
	metrixnote :any
    controlstringify:any

    show_fileextnerror_feature: boolean = false;
    show_fileextnerror_excludematching: boolean = false;
    model1: NgbDateStruct;
    model2: NgbDateStruct;
    stdate: any;
    enddate: any;
    category_array: any = [];
    product_array: any = [];
    seleceted: any = [];
    newarray: any = [];
    frmData1: FormData;
    frmData2: FormData;
    hierlvl: any;
    adjustedval: any;
    selectedToAdd: any[] = [];
    selectedToRemove: any[] = [];
    movedisable: boolean = true;
    removedisable: boolean = true;
    public term: string;
    selstatus: boolean = false;
    unselstatus: boolean = false;
    ap: any = 1;
    mp: any = 1;
    // highlighttext:any=['name6','name8','name1'];
    highlight_additionlfeat: any = ['dvSalesSum_trend','GCs_Total_trend','TotNet_trend'];
    // highlight_additionlfeat: any = [];
    arr2: any = [];
	noteshow:boolean = false;
    startmindate:any ;
    endmindate:any;
    //]] highlighttext:any=['net_lrgdblqtrvmnp','Income_pctofPersons_Persons_0003','Age_pctofPersons_Age_years__0015'];

    //level:any;

    closeResult: string;
    consideredfeat = Array.from({
        length: 1000
    }).map((_, i) => `area_site_${i}`);

    public testmetric: any[] = [{
            metricid: 1,
            metricname: 'Wt Avg Price'
        },
        {
            metricid: 2,
            metricname: '% Sales'
        }
    ];
    public hierarchy: any[] = [{
            hier_id: 1,
            hier_name: 'Level 1'
        },
        {
            hier_id: 2,
            hier_name: 'Level 2'
        },
        {
            hier_id: 3,
            hier_name: 'Level 3'
        },
        {
            hier_id: 4,
            hier_name: 'Level 4'
        }
    ];

    public VisResTeststr: any[] = [{
            vistest_id: 1,
            vistest_name: 'Test Store 1'
        },
        {
            vistest_id: 2,
            vistest_name: 'Test Store 2'
        }
    ];

    treeControl = new NestedTreeControl < ConsideredFeatVals > (node => node.children);
    TreeSource = new MatTreeNestedDataSource < ConsideredFeatVals > ();
    hasChild = (_: number, node: ConsideredFeatVals) => !!node.children && node.children.length > 0;

    /*required validation*/
    target_metric_req: boolean = true;
    hier_req: boolean = true;
    prdcat_req: boolean = true;
    prd_req: boolean = true;
    startdt_req: boolean = true;
    enddt_req: boolean = true;
    file_add_req: boolean = true;
    date_valid: boolean = true;
    sample_array: any = [];
    testvscntrl_testr1:any =[]
	reportcolumns :any =[]
    testvscntrl_teststore: any = [];
	reportdata :any =[]
    catmembers: SelectItem[] = [];
    prductmembers: Productlist[] = [];
    /*required validation*/
    testmetricmodelid: any = [];
    analystringify:any;
    hiermodelid: any = [];
    vistest_modelid: any = [];
    duration_weekss:any;
    PrdCatmodelid: any = [];
    Prdmodelid: any = '';
    ProductList: any = [];
    ProductSettings: any = {};
    ProductCat: any = [];
    ProductCategorySettings: any = {};
    days: number = 0; //change to 0
    date: NgbDateStruct;
    items: any = [];
    checked: any = [];
    tempFilter: any;
    //selected:any;
    unselected: any = [];
    working_teststores:any =[];
    unselected_const: any = [];
    selecteditems: any = [];
    Advancedsettingdata: any;
    MatchResultsdata: any;
    TestVscntrlSet: any = {};
    StatResultsdata: any;
    CompletedStep3: any = false;
    CompletedStep4: any = false;
    currentres: boolean = true;
    products_text:any;
    category_text:any
    currentvr: boolean = false;
    currentssr: boolean = false;
    stepindex: any;
    myFiles1: any = [];
    myFiles2: any = [];
    temp_Datas:any;
    uploadAdditionalFeat: FormGroup;
    show_match_results: boolean = true;
    show_visualize_results: boolean = true;
    show_statistical_results: boolean = false;
    // considered_feats: any = (data as any).data;//json
    TREE_DATA: any = [];
    adv_teststore_id: any = [];
    adv_teststore_state: any = [];
    state: any = [];
    state_disabled: boolean = true;
    storetype_disabled: boolean = true;
    analystartdate:any;
    analyenddate:any;
    locality_disabled: boolean = true;
    Teststorelbl: boolean = false;
    weekendDate: any = []
    Additional_Features_data: any;
    Fulltablevalue:any = [] 
    parse_sales_data: any = []
    adv_teststoreobj: any = []
    final_settings: any = []
    loaddatas:boolean = false
    AdvanceData: AdvSettingvalues[] = [];
    MatchValues_DATA: Matchresultvalues[] = [];
    Stat_Result_Data: Stat_Result_Data[] = [

    ];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('chartclick') chartclick: ElementRef;

    AdvSettingDatasrc = new MatTableDataSource < any > (this.AdvanceData);
    MatchValuesDatasrc = new MatTableDataSource < any > (this.MatchValues_DATA);
    StatValuesDatasrc = new MatTableDataSource < any > (this.Stat_Result_Data);

    /*------------------Advance start----------------------------------------*/
    selection = new SelectionModel < AdvSettingvalues > (true, []);
    selectionstate = new SelectionModel < AdvSettingvalues > (true, []);
    selectionstoretype = new SelectionModel < AdvSettingvalues > (true, []);
    selectionlocality = new SelectionModel < AdvSettingvalues > (true, []);

    /*-----------------------Common------toggle,Seelect all------------*/
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.AdvSettingDatasrc.data.forEach(row => this.selection.select(row));
        this.isAllSelectedState() ?
            this.selectionstate.clear() :
            this.AdvSettingDatasrc.data.forEach(row => this.selectionstate.select(row));
        this.isAllSelectedStoretype() ?
            this.selectionstoretype.clear() :
            this.AdvSettingDatasrc.data.forEach(row => this.selectionstoretype.select(row));
        this.isAllSelectedLocality() ?
            this.selectionlocality.clear() :
            this.AdvSettingDatasrc.data.forEach(row => this.selectionlocality.select(row));
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.AdvSettingDatasrc.data.length;
        return numSelected === numRows;
    }
    /*-----------------------Common------toggle,Seelect all------------*/

    /*------------------------State toggle,select all-------------------*/
    masterToggleState() {
        this.isAllSelectedState() ? this.selectionstate.clear() : this.selectRows_state();
    }

    isAllSelectedState() {
        const numSelected = this.selectionstate.selected.length;
        const numRows = this.AdvSettingDatasrc.data.length;
        return numSelected === numRows;
    }
    /*------------------------State toggle,select all-------------------*/

    /*------------------------Storetype toggle,select all-------------------*/

    masterToggleStoretype() {
        this.isAllSelectedStoretype() ? this.selectionstoretype.clear() : this.selectRows_storetype();
    }

    isAllSelectedStoretype() {
        const numSelected = this.selectionstoretype.selected.length;
        const numRows = this.AdvSettingDatasrc.data.length;
        return numSelected === numRows;
    }

    /*------------------------Storetype toggle,select all-------------------*/

    /*------------------------Locality toggle,select all-------------------*/

    masterToggleLocality() {
        this.isAllSelectedLocality() ? this.selectionlocality.clear() : this.selectRows_local();
    }

    isAllSelectedLocality() {
        const numSelected = this.selectionlocality.selected.length;
        const numRows = this.AdvSettingDatasrc.data.length;
        return numSelected === numRows;
    }
    /*------------------------Locality toggle,select all-------------------*/

    /*------------------------Test store id select-------------------------*/
    private selected_Row($event: any, Selectedstoredata: any, i: any) {
        if ($event.checked) {
            Selectedstoredata['State'] = null;
            Selectedstoredata['StoreType'] = null;
            Selectedstoredata['Locality'] = null;
            Selectedstoredata['checkedstate'] = false;
            this.adv_teststore_id.push(Selectedstoredata);

            if (this.adv_teststore_id.length >= 1) {
                this.state_disabled = false;
                this.storetype_disabled = false;
                this.locality_disabled = false;
            }
        } else {
            if (this.adv_teststore_id.length === 1) {
                this.state_disabled = true;
                this.storetype_disabled = true;
                this.locality_disabled = true;
            }

            let el = this.adv_teststore_id.find((itm: any) => itm.TestStore === Selectedstoredata.TestStore);
            if (el) {
                this.adv_teststore_id.splice(this.adv_teststore_id.indexOf(el), 1);
                Selectedstoredata['checkedstate'] = true;
            }
        }
    }
    /*------------------------Test store id select-------------------------*/

    /*--------------------SELECT ALL PUSH VALUES----------------------------*/

    selectedall($event: any, Selectedstoredata: any) {
        this. AdvSettingDatasrc.data = this.AdvanceData
        if ($event.checked) {
            this.adv_teststore_id = [];
            for (var i = 0; i < this.AdvSettingDatasrc.data.length; i++) {
                this.AdvSettingDatasrc.data[i]['State'] = 1;
                this.AdvSettingDatasrc.data[i]['StoreType'] = 1;
                this.AdvSettingDatasrc.data[i]['Locality'] = 1;
                this.AdvSettingDatasrc.data[i]['checkedstate'] = false;
                if (this.adv_teststore_id.indexOf(this.AdvSettingDatasrc[i]) === -1) {
                    this.adv_teststore_id.push(this.AdvSettingDatasrc.data[i]);
                }
                if (this.adv_teststore_id.length >= 1) {
                    this.state_disabled = false;
                    this.storetype_disabled = false;
                    this.locality_disabled = false;
                }
            }
        } else {
            this.selectionstate.clear();
            this.selectionstoretype.clear();
            this.selectionlocality.clear();
            for (var i = 0; i < this.AdvSettingDatasrc.data.length; i++) {
                this.AdvSettingDatasrc.data[i]['checkedstate'] = true;
                this.adv_teststore_id.push(this.AdvSettingDatasrc.data[i]);
            }
            this.adv_teststore_id = [];
            this.state_disabled = true;
            this.storetype_disabled = true;
            this.locality_disabled = true;
        }
    }

    selectedallstate($event: any, Selectedstoredata: any) {
        if ($event.checked) {
            for (var i = 0; i < this.adv_teststore_id.length; i++) {
                this.adv_teststore_id[i]['State'] = 1;

                if (this.adv_teststore_id.indexOf(this.adv_teststore_id[i]) === -1) {
                    this.AdvSettingDatasrc.data.push(this.adv_teststore_id[i]);
                }
            }
        } else {
            for (var i = 0; i < this.adv_teststore_id.length; i++) {
                this.adv_teststore_id[i]['State'] = null;
                this.selectionstate.clear();

                if (this.adv_teststore_id.indexOf(this.adv_teststore_id[i]) === -1) {
                    this.AdvSettingDatasrc.data.push(this.adv_teststore_id[i]);
                }
            }
        }
    }

    selectedallstore($event: any, Selectedstoredata: any) {
        if ($event.checked) {
            for (var i = 0; i < this.adv_teststore_id.length; i++) {
                this.adv_teststore_id[i]['StoreType'] = 1;

                if (this.adv_teststore_id.indexOf(this.adv_teststore_id[i]) === -1) {
                    this.AdvSettingDatasrc.data.push(this.adv_teststore_id[i]);
                }
            }
        } else {
            for (var i = 0; i < this.adv_teststore_id.length; i++) {
                this.adv_teststore_id[i]['StoreType'] = null;
                this.selectionstoretype.clear();

                if (this.adv_teststore_id.indexOf(this.adv_teststore_id[i]) === -1) {
                    this.AdvSettingDatasrc.data.push(this.adv_teststore_id[i]);
                }
            }
        }
    }

    selectedallocality($event: any, Selectedstoredata: any) {
        if ($event.checked) {
            for (var i = 0; i < this.adv_teststore_id.length; i++) {
                this.adv_teststore_id[i]['Locality'] = 1;

                if (this.adv_teststore_id.indexOf(this.adv_teststore_id[i]) === -1) {
                    this.AdvSettingDatasrc.data.push(this.adv_teststore_id[i]);
                }
            }
        } else {
            for (var i = 0; i < this.adv_teststore_id.length; i++) {
                this.adv_teststore_id[i]['Locality'] = null;
                this.selectionlocality.clear();

                if (this.adv_teststore_id.indexOf(this.adv_teststore_id[i]) === -1) {
                    this.AdvSettingDatasrc.data.push(this.adv_teststore_id[i]);
                }
            }
        }
    }
    /*--------------------SELECT ALL PUSH VALUES----------------------------*/

    /*Selection upto testore length*/
    selectRows_state() {
        for (let index = 0; index < this.adv_teststore_id.length; index++) {
            const storeindex: number = this.AdvSettingDatasrc.data.indexOf(this.adv_teststore_id[index]);
            this.selectionstate.select(this.AdvSettingDatasrc.data[storeindex]);
        }
    }

    selectRows_storetype() {
        for (let index = 0; index < this.adv_teststore_id.length; index++) {
            const storeindex: number = this.AdvSettingDatasrc.data.indexOf(this.adv_teststore_id[index]);
            this.selectionstoretype.select(this.AdvSettingDatasrc.data[storeindex]);
        }
    }

    selectRows_local() {
        for (let index = 0; index < this.adv_teststore_id.length; index++) {
            const storeindex: number = this.AdvSettingDatasrc.data.indexOf(this.adv_teststore_id[index]);
            this.selectionlocality.select(this.AdvSettingDatasrc.data[storeindex]);
        }
    }
    /*Selection upto testore length*/

    /*Indivual select state,store,locality value update*/
    private selected_state_Row($event: any, Selectedstoredata: any, i: any) {
        if ($event.checked) {
            Selectedstoredata.State = 1;
        } else {
            Selectedstoredata.State = null;
        }
    }

    private selected_store_Row($event: any, Selectedstoredata: any, i: any) {
        if ($event.checked) {
            Selectedstoredata.StoreType = 1;
        } else {
            Selectedstoredata.StoreType = null;
        }
    }

    private selected_locality_Row($event: any, Selectedstoredata: any, i: any) {
        if ($event.checked) {
            Selectedstoredata.Locality = 1;
        } else {
            Selectedstoredata.Locality = null;
        }
    }
    /*Indivual select state,store,locality value update*/

    /*------------------Advance end----------------------------------------*/

    @ViewChild(WizardComponent)
    public wizard: WizardComponent;
    displayedColumns: string[] = ['TestStore', 'State', 'StoreType', 'Locality'];
    displayedColsMatchrslts: string[] = ['Test Store', 'Control Store', 'Similarity Value', 'Sales Correlation'];
    displayedColsStatrslts: string[] = [];
    /*------------Filter Tables---------------*/
    Filterstores(event: string) {
        const val = event.toLowerCase();
        this.tempFilter = this.AdvanceData;
        const temp = this.tempFilter.filter(function(d: any) {
            return d.TestStore.toString().indexOf(val) !== -1;
        });
        this.Advancedsettingdata = temp;
    }

    FilterMatchVals(event: string) {
        const val = event.toLowerCase();
        this.tempFilter = this.MatchValues_DATA;
        const temp = this.tempFilter.filter(function(d: any) {
            return (
                d.TestStore.toString()
                .toLowerCase()
                .indexOf(val) !== -1 || !val
            );
        });
        this.MatchResultsdata = temp;
    }

    FilterStatVals(event: string) {
        const val = event.toLowerCase();
        this.tempFilter = this.Stat_Result_Data;
        const temp = this.tempFilter.filter(function(d: any) {
            return d.VariableName.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.StatResultsdata = temp;
    }


    /*------------Filter Tables---------------*/
    constructor(
        private wizard2service: ControlStoreService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        // private _notificationsService: NotificationsService,
        private _snackBar: MatSnackBar,
        private ngzone: NgZone,
        private ngxService: NgxUiLoaderService
    ) {}

    ngOnInit() {
        /// Static Code start here -----------------------------
        // this.testmetricmodelid = 2;
        // this.hiermodelid = 3;
        // let temp_catep = [{"levelthree_cate": "Bacon & Egg McMuffin"}, {"levelthree_cate": "Hot Cakes"}, {"levelthree_cate": "Breakfast Promo Burgers"}, {"levelthree_cate": "Gourmet Salad"}, {"levelthree_cate": "Promo Burger Red"}, {"levelthree_cate": "Breakfast Promo Other"}, {"levelthree_cate": "Not Valid"}, {"levelthree_cate": "Toasted Sandwiches"}, {"levelthree_cate": "Big Breakfast"}, {"levelthree_cate": "Other Breakfast"}, {"levelthree_cate": "English Muffin"}, {"levelthree_cate": "Extra Serving"}, {"levelthree_cate": "Coffee (PRONTO)"}, {"levelthree_cate": "Water"}, {"levelthree_cate": "Pot of Tea"}, {"levelthree_cate": "Cold Drinks Other"}, {"levelthree_cate": "Soft Drink"}, {"levelthree_cate": "Shakes"}, {"levelthree_cate": "Slices Other"}, {"levelthree_cate": "Hamburger"}, {"levelthree_cate": "Cheeseburger"}, {"levelthree_cate": "Dbl Cheeseburger"}, {"levelthree_cate": "Big Mac"}, {"levelthree_cate": "McOz"}, {"levelthree_cate": "McChicken"}, {"levelthree_cate": "Filet-o-Fish"}, {"levelthree_cate": "Nuggets 6"}, {"levelthree_cate": "Nuggets 9"}, {"levelthree_cate": "Promo Other"}, {"levelthree_cate": "Roast Chicken Half"}, {"levelthree_cate": "Roast Chicken Whl"}, {"levelthree_cate": "Fries Ind"}, {"levelthree_cate": "Nuggets 3"}, {"levelthree_cate": "Promo Burger White"}, {"levelthree_cate": "Dinner Box"}, {"levelthree_cate": "Lamington"}, {"levelthree_cate": "Donut"}, {"levelthree_cate": "Desserts Other"}, {"levelthree_cate": "Cheese & Bacon Bgr"}, {"levelthree_cate": "Gourmet Extra"}, {"levelthree_cate": "Chicken McDippers"}, {"levelthree_cate": "Salad"}, {"levelthree_cate": "Sundae"}, {"levelthree_cate": "Cone & Flake"}, {"levelthree_cate": "Soft serve"}, {"levelthree_cate": "Cones"}, {"levelthree_cate": "Other Cones"}, {"levelthree_cate": "McFlurry"}, {"levelthree_cate": "Gourmet Create Extra"}, {"levelthree_cate": "Chicken Caesar Wrap Seared"}, {"levelthree_cate": "Chicken Tandoori Wrap"}, {"levelthree_cate": "Chicken Sweet Chilli Wrap Sear"}, {"levelthree_cate": "Pies"}, {"levelthree_cate": "Muffins"}, {"levelthree_cate": "Donuts Iced"}, {"levelthree_cate": "Danish"}, {"levelthree_cate": "Cookies"}, {"levelthree_cate": "Pies/Rolls"}, {"levelthree_cate": "Cake & Drink"}, {"levelthree_cate": "Buns"}, {"levelthree_cate": "Custard Tarts"}, {"levelthree_cate": "Slices Caramel"}, {"levelthree_cate": "Cheesecakes"}, {"levelthree_cate": "Cakes"}, {"levelthree_cate": "Extra coffee"}, {"levelthree_cate": "Fruit Based"}, {"levelthree_cate": "Panini/Focaccia"}, {"levelthree_cate": "Latte"}, {"levelthree_cate": "McChiller"}, {"levelthree_cate": "Espresso"}, {"levelthree_cate": "Vienna"}, {"levelthree_cate": "Breads"}, {"levelthree_cate": "Cappuccino"}, {"levelthree_cate": "Flat White"}, {"levelthree_cate": "Long Black"}, {"levelthree_cate": "Mocha"}, {"levelthree_cate": "Hot Chocolate"}, {"levelthree_cate": "Iced Chocolate"}, {"levelthree_cate": "Iced Coffee"}, {"levelthree_cate": "Plunger Tea"}, {"levelthree_cate": "Milk Based"}, {"levelthree_cate": "Juice"}, {"levelthree_cate": "Sandwich"}, {"levelthree_cate": "Raisin Toast"}, {"levelthree_cate": "Other Sweet"}, {"levelthree_cate": "QTR P"}, {"levelthree_cate": "Dbl Qtr Pounder"}, {"levelthree_cate": "Dinner Meal"}, {"levelthree_cate": "Non Food Items"}, {"levelthree_cate": "Bacon & Egg McGriddle"}, {"levelthree_cate": "Dbl Bacon McMuffin"}, {"levelthree_cate": "Sauce Tub"}, {"levelthree_cate": "Sausage & Egg McMuffin"}, {"levelthree_cate": "Sausage & Egg McGriddle"}, {"levelthree_cate": "Sausage McMuffin"}, {"levelthree_cate": "Sausage McGriddle"}, {"levelthree_cate": "Bagel"}, {"levelthree_cate": "McGriddle"}, {"levelthree_cate": "Maple McGriddle"}, {"levelthree_cate": "Thick Toast"}, {"levelthree_cate": "Smoothie"}, {"levelthree_cate": "Bakehouse Brekkie Roll"}, {"levelthree_cate": "Gourmet Avocado Smash"}, {"levelthree_cate": "Rosti Brekkie Wrap"}, {"levelthree_cate": "Brekkie Snack Wrap"}, {"levelthree_cate": "Bacon Egg Tom Wrap"}, {"levelthree_cate": "Aussie Brekkie Wrap"}, {"levelthree_cate": "Pesto & Fetta Wrap"}, {"levelthree_cate": "Pesto Fetta & Bacon"}, {"levelthree_cate": "French Toast Fingers"}, {"levelthree_cate": "Blueberry McGriddle"}, {"levelthree_cate": "Frappe"}, {"levelthree_cate": "English BKFST Wrap"}, {"levelthree_cate": "Tomato Brekkie Muffin"}, {"levelthree_cate": "Gourmet Big Breakfast"}, {"levelthree_cate": "Gourmet CYT Breakfast"}, {"levelthree_cate": "Gourmet B/E Brioche"}, {"levelthree_cate": "Gourmet Waffle"}, {"levelthree_cate": "Gourmet Corn Fritters"}, {"levelthree_cate": "Birthday Muffin"}, {"levelthree_cate": "Hash Browns Ind"}, {"levelthree_cate": "Dbl Bacon & Egg McMuffin"}, {"levelthree_cate": "Dbl Sausage & Egg McMuffin"}, {"levelthree_cate": "Dbl Sausage McMuffin"}, {"levelthree_cate": "Bagel Jam"}, {"levelthree_cate": "Bacon Egg Bagel"}, {"levelthree_cate": "Eggs Benedict"}, {"levelthree_cate": "Gourmet Chicken"}, {"levelthree_cate": "Frozen Soft Drink"}, {"levelthree_cate": "Fruit English Muffin"}, {"levelthree_cate": "Mighty Muffin"}, {"levelthree_cate": "Toastie"}, {"levelthree_cate": "Panini"}, {"levelthree_cate": "Muffin BLT"}, {"levelthree_cate": "Breakfast Promo Cereal"}, {"levelthree_cate": "Brekky Oats"}, {"levelthree_cate": "Frozen Soft Drink Float"}, {"levelthree_cate": "Breakfast Promo Juice"}, {"levelthree_cate": "100% Juice"}, {"levelthree_cate": "Banana Custard"}, {"levelthree_cate": "Berrynice Crunch"}, {"levelthree_cate": "Condiments"}, {"levelthree_cate": "Apple Pie"}, {"levelthree_cate": "Donation"}, {"levelthree_cate": "Chicken Brekkie Roll"}, {"levelthree_cate": "Brownie"}, {"levelthree_cate": "Slices paleo bounty"}, {"levelthree_cate": "Slices Paleo Truffle"}, {"levelthree_cate": "Slices Salted Caramel"}, {"levelthree_cate": "Dbl Bacon BBQ"}, {"levelthree_cate": "Scrambled Eggs"}, {"levelthree_cate": "Knife for KVS"}, {"levelthree_cate": "Bacon"}, {"levelthree_cate": "Egg"}, {"levelthree_cate": "Hot Cake Syrup"}, {"levelthree_cate": "Gelato"}, {"levelthree_cate": "Nugget Sauce"}, {"levelthree_cate": "Regular Patty"}, {"levelthree_cate": "Qtr Patty"}, {"levelthree_cate": "Tomato"}, {"levelthree_cate": "Crispy Chicken Patty"}, {"levelthree_cate": "Sundae Topping"}, {"levelthree_cate": "Sipahh Milk"}, {"levelthree_cate": "Flake"}, {"levelthree_cate": "Twirl"}, {"levelthree_cate": "Seared Chicken Patty"}, {"levelthree_cate": "Ice Break"}, {"levelthree_cate": "Mayonaise"}, {"levelthree_cate": "3:1 Meat Patty"}, {"levelthree_cate": "Marsh Mallows"}, {"levelthree_cate": "NW Berry Chia Pudding"}, {"levelthree_cate": "Macarons"}, {"levelthree_cate": "Ham Colby Chs Wrap"}, {"levelthree_cate": "Sthwst Chk Wrap"}, {"levelthree_cate": "NW Chicken Herb Wrap"}, {"levelthree_cate": "Syrups"}, {"levelthree_cate": "Milk Shakes"}, {"levelthree_cate": "Soup"}, {"levelthree_cate": "Sandwich Chs"}, {"levelthree_cate": "Sandwich Chs Tom"}, {"levelthree_cate": "Sandwich Ham Chs"}, {"levelthree_cate": "Sandwich Ham Chs Tom"}, {"levelthree_cate": "Boiled Eggs Baby Spinach"}, {"levelthree_cate": "NW Pesto Chkn Wrap"}, {"levelthree_cate": "Reg Serve"}, {"levelthree_cate": "Scroll"}, {"levelthree_cate": "Caramel Kiss"}, {"levelthree_cate": "Florentine"}, {"levelthree_cate": "Protein Ball"}, {"levelthree_cate": "Coffee Pack"}, {"levelthree_cate": "Gourmet Extra BF"}, {"levelthree_cate": "Bak Choc Croissant"}, {"levelthree_cate": "Bak Almond Croissant"}, {"levelthree_cate": "Flatbread pumkin"}, {"levelthree_cate": "Bottle Syrup"}, {"levelthree_cate": "Gourmet Eggs on Toast"}, {"levelthree_cate": "Onoins"}, {"levelthree_cate": "Avocado & Fetta"}, {"levelthree_cate": "Iced Mocha"}, {"levelthree_cate": "Gourmet Create Breakfast"}, {"levelthree_cate": "Apple Juice"}, {"levelthree_cate": "Sparkling Jiuce"}, {"levelthree_cate": "Milk"}, {"levelthree_cate": "Orange Juice"}, {"levelthree_cate": "Nudie"}, {"levelthree_cate": "Ham Chs Pocket"}, {"levelthree_cate": "Iced Tea"}, {"levelthree_cate": "Pineapple Coconut Bread"}, {"levelthree_cate": "Chocolate Coconut Muffin"}, {"levelthree_cate": "Full cream milk for coffee"}, {"levelthree_cate": "Skim milk for coffee"}, {"levelthree_cate": "Tea"}, {"levelthree_cate": "Soy milk for coffee"}, {"levelthree_cate": "Espresso (PRONTO)"}, {"levelthree_cate": "Chocolate Drinks"}, {"levelthree_cate": "Real Fruit Smoothie"}, {"levelthree_cate": "Promo Angus"}, {"levelthree_cate": "Calciyum"}, {"levelthree_cate": "Uber Kids"}, {"levelthree_cate": "Flexi Meal"}, {"levelthree_cate": "Gourmet Vegetarian"}, {"levelthree_cate": "Gourmet Brie"}, {"levelthree_cate": "Gourmet Haloumi"}, {"levelthree_cate": "Gourmet Pork"}, {"levelthree_cate": "Guac and salsa chips"}, {"levelthree_cate": "Spring water"}, {"levelthree_cate": "Energy Drink"}, {"levelthree_cate": "Keep Cup"}, {"levelthree_cate": "Gourmet Angus"}, {"levelthree_cate": "Flexi Side"}, {"levelthree_cate": "Garden Salad"}, {"levelthree_cate": "Loaded Fries"}, {"levelthree_cate": "Angus Pie"}, {"levelthree_cate": "Jaffa Slice"}, {"levelthree_cate": "Crispy Chicken Snack Wrap"}, {"levelthree_cate": "Seared Chicken Snack Wrap"}, {"levelthree_cate": "Cakes Other"}, {"levelthree_cate": "Scones"}, {"levelthree_cate": "Ind Tarts"}, {"levelthree_cate": "Friand"}, {"levelthree_cate": "Ind Cupcakes"}, {"levelthree_cate": "Cake Rolls"}, {"levelthree_cate": "Slices Mudcake"}, {"levelthree_cate": "Slices Banana"}, {"levelthree_cate": "Slices American Brownie"}, {"levelthree_cate": "Slices Bite size Mint"}, {"levelthree_cate": "Slices Bite size Caramel"}, {"levelthree_cate": "Slices Bite size Cherry"}, {"levelthree_cate": "Whole Cake Other"}, {"levelthree_cate": "Whole Cake"}, {"levelthree_cate": "Kez Cookies"}, {"levelthree_cate": "Donuts Jam Ball"}, {"levelthree_cate": "Lite Muffin"}, {"levelthree_cate": "Chicken McCheese"}, {"levelthree_cate": "Ham Focaccia"}, {"levelthree_cate": "Chicken Focaccia"}, {"levelthree_cate": "Freo Burger"}, {"levelthree_cate": "WAFL Burger"}, {"levelthree_cate": "Nuggets 10"}, {"levelthree_cate": "Nuggets 20"}, {"levelthree_cate": "Cruffin"}, {"levelthree_cate": "Date and Walnut Loaf"}, {"levelthree_cate": "Nuggets & Wings"}, {"levelthree_cate": "Box for Two"}, {"levelthree_cate": "Snack Bundle"}, {"levelthree_cate": "Matcha Latte"}, {"levelthree_cate": "Homestyle Angus"}, {"levelthree_cate": "Gourmet Create Chicken"}, {"levelthree_cate": "Swiss Chicken Bgr"}, {"levelthree_cate": "Gourmet Create Halloumi"}, {"levelthree_cate": "Halloumi Burger"}, {"levelthree_cate": "Classic Chicken Burger"}, {"levelthree_cate": "Classic Angus Burger"}, {"levelthree_cate": "Chicken Caesar Burger"}, {"levelthree_cate": "Gourmet Create Beef"}, {"levelthree_cate": "Truffle Cheese Angus Burger"}, {"levelthree_cate": "Other Slice"}, {"levelthree_cate": "Brownie Slice"}, {"levelthree_cate": "Peri Peri Chicken Wrap"}, {"levelthree_cate": "Big Mac Chicken Wrap"}, {"levelthree_cate": "Gourmet Create Steak"}, {"levelthree_cate": "Steak & Egg Burger"}, {"levelthree_cate": "BBQ Bacon Lovers Burger"}, {"levelthree_cate": "Spicy Chorizo & Chicken Bgr"}, {"levelthree_cate": "Frozen Soft Drink Flavour"}, {"levelthree_cate": "Cowboys Burger"}, {"levelthree_cate": "Non Product"}, {"levelthree_cate": "Iced Lemonade"}, {"levelthree_cate": "Uber Breakfast"}, {"levelthree_cate": "BBQ Hashbrown"}, {"levelthree_cate": "McFeast"}, {"levelthree_cate": "Gourmet Create Salad"}, {"levelthree_cate": "Uber Bundle"}, {"levelthree_cate": "Pasta Zoo"}, {"levelthree_cate": "Chkn & Mayo"}, {"levelthree_cate": "Cheeseburger Smoky BBQ"}, {"levelthree_cate": "McRib"}, {"levelthree_cate": "Herb Chicken Salad"}, {"levelthree_cate": "Lean Beef Burger"}, {"levelthree_cate": "Chicken Tandoori Roll"}, {"levelthree_cate": "Thai Chicken Roll"}, {"levelthree_cate": "Turkey & Cranberry Roll"}, {"levelthree_cate": "Apple"}, {"levelthree_cate": "Seared Chicken Classic Burger"}, {"levelthree_cate": "Nuggets & Fries"}, {"levelthree_cate": "Nuggets 15"}, {"levelthree_cate": "Broncos Burger"}, {"levelthree_cate": "Grand Mac"}, {"levelthree_cate": "Beef Patty 5:1"}, {"levelthree_cate": "Roast Chicken Qtr"}, {"levelthree_cate": "Double Angus Bacon Bgr"}, {"levelthree_cate": "Chicken Tenders"}, {"levelthree_cate": "Angus BLT"}, {"levelthree_cate": "Grilled Chicken"}, {"levelthree_cate": "Spicy Nuggets"}, {"levelthree_cate": "Spicy Nuggets 3"}, {"levelthree_cate": "Spicy Nuggets 6"}, {"levelthree_cate": "Spicy Nuggets 10"}, {"levelthree_cate": "Spicy Nuggets 20"}, {"levelthree_cate": "Gourmet Create Pork"}, {"levelthree_cate": "Thick Cut Pork Burger"}, {"levelthree_cate": "Mac Wrap"}, {"levelthree_cate": "Chicken Wings"}, {"levelthree_cate": "3 Fish Bites"}, {"levelthree_cate": "6 Fish Bites"}, {"levelthree_cate": "Corn"}, {"levelthree_cate": "Indulgent Shake"}, {"levelthree_cate": "Gourmet Thick Cut Chips"}, {"levelthree_cate": "NP6 Wedges VM"}, {"levelthree_cate": "Chicken Sweet Chilli Wrap Cris"}, {"levelthree_cate": "Chicken Caesar Wrap Crispy"}, {"levelthree_cate": "Chicken Tandoori Wrap Cris"}, {"levelthree_cate": "Custard Pie"}, {"levelthree_cate": "Chicken Bites 5"}, {"levelthree_cate": "Shaker Fries"}, {"levelthree_cate": "Chicken Bites 10"}, {"levelthree_cate": "Grand Angus Burger"}, {"levelthree_cate": "Mighty Angus Burger"}, {"levelthree_cate": "Packaging Box"}, {"levelthree_cate": "Pulled Pork Burger"}, {"levelthree_cate": "Big Mac BLT"}, {"levelthree_cate": "Chicken Mac"}, {"levelthree_cate": "Spicy Nuggets 24"}, {"levelthree_cate": "Double Beef & Bacon"}, {"levelthree_cate": "NP6 Burger Option"}, {"levelthree_cate": "NP6 Orange Juice Meal"}, {"levelthree_cate": "NP6 Bacon & Egg McMuffin"}, {"levelthree_cate": "NP6 Sausage & Egg McMuffin"}, {"levelthree_cate": "NP6 Cake Option"}, {"levelthree_cate": "NP6 Muffin Option"}, {"levelthree_cate": "NP6 McCafe Sandwich Option"}, {"levelthree_cate": "NP6 Donut Option"}, {"levelthree_cate": "Croissants Lge"}, {"levelthree_cate": "Triple Cheeseburger"}, {"levelthree_cate": "McFrosty"}, {"levelthree_cate": "Add On Coffee"}, {"levelthree_cate": "Vanilla Slice"}, {"levelthree_cate": "Crispy Chicken Ranch Burger"}, {"levelthree_cate": "Crispy Chicken Bacon Ranch Bgr"}, {"levelthree_cate": "Seared Chicken Ranch Burger"}, {"levelthree_cate": "Seared Chicken Bacon Ranch Bgr"}, {"levelthree_cate": "Monopoly Bundle"}, {"levelthree_cate": "Crispy Grand Burger"}, {"levelthree_cate": "Seared Grand Burger"}, {"levelthree_cate": "Fish Fingers"}, {"levelthree_cate": "Chicken Bites 20"}, {"levelthree_cate": "Spicy Chicken Burger"}, {"levelthree_cate": "ChickenSchorcher"}, {"levelthree_cate": "Buffalo Bites"}, {"levelthree_cate": "Nuggets 40"}, {"levelthree_cate": "Crispy Chicken Classic Burger"}, {"levelthree_cate": "Buffalo Chicken Burger"}, {"levelthree_cate": "Bacon Jam Burger"}, {"levelthree_cate": "Son Of Mac"}, {"levelthree_cate": "Chicken Clubhouse"}, {"levelthree_cate": "Tandoori Wrap"}, {"levelthree_cate": "Spicy Chicken Wrap"}, {"levelthree_cate": "Chicken Caesar Wrap"}, {"levelthree_cate": "Classic Beef Wrap"}, {"levelthree_cate": "Extras"}, {"levelthree_cate": "Iced Latte"}, {"levelthree_cate": "Mega Mac"}, {"levelthree_cate": "Georgie Pie"}, {"levelthree_cate": "Chocolate Coconut Latte"}, {"levelthree_cate": "Chicken McFeast"}, {"levelthree_cate": "Nuggets 24"}, {"levelthree_cate": "McChamp"}, {"levelthree_cate": "Wagyu Burger"}, {"levelthree_cate": "Chicken Caesar Roll"}, {"levelthree_cate": "Roast Beef Roll"}, {"levelthree_cate": "Promo Deli Choices"}, {"levelthree_cate": "Sweet Chilli Chicken Wrap"}, {"levelthree_cate": "Premium Chicken Roll"}, {"levelthree_cate": "Premium Steak Roll"}, {"levelthree_cate": "BLT Deli Roll"}, {"levelthree_cate": "BLT Roll"}, {"levelthree_cate": "Bacon & Egg Roll"}, {"levelthree_cate": "Deluxe Brekkie Roll"}, {"levelthree_cate": "Dbl Filet-o-Fish"}, {"levelthree_cate": "Hash Brown Bites 24"}, {"levelthree_cate": "Angus Cheeseburger"}, {"levelthree_cate": "Minion Bites"}, {"levelthree_cate": "McDouble"}, {"levelthree_cate": "Cupcake"}, {"levelthree_cate": "Jalapeno Chicken Bgr"}, {"levelthree_cate": "Halloumi Bgr"}, {"levelthree_cate": "Fruit Loaf 1 Slice"}, {"levelthree_cate": "Cheeseburger Deluxe"}, {"levelthree_cate": "BLT"}, {"levelthree_cate": "Wedges"}, {"levelthree_cate": "BIM Sampling"}, {"levelthree_cate": "Chicken Fillet Deluxe"}, {"levelthree_cate": "Socks"}, {"levelthree_cate": "Dbl Filet Deluxe"}, {"levelthree_cate": "Helping Hand"}, {"levelthree_cate": "McSpicy"}, {"levelthree_cate": "McGrilled"}, {"levelthree_cate": "Crispy Chicken Fillet Bgr"}, {"levelthree_cate": "Breakfast Box"}, {"levelthree_cate": "Fish Bites"}, {"levelthree_cate": "Classic Ham Roll"}, {"levelthree_cate": "Italian Supreme Roll"}, {"levelthree_cate": "Vege Plus Deli Roll"}, {"levelthree_cate": "Vege Pesto Roll"}, {"levelthree_cate": "Mustard Beef Roll"}, {"levelthree_cate": "Parmi Chck Wrap"}, {"levelthree_cate": "Parmi Chck Snack Wrap"}, {"levelthree_cate": "Brekkie Box"}, {"levelthree_cate": "Extra"}, {"levelthree_cate": "SB NP6 Option"}, {"levelthree_cate": "AFL Football"}, {"levelthree_cate": "Waffle Cone"}, {"levelthree_cate": "Football"}, {"levelthree_cate": "Dinner Chicken"}, {"levelthree_cate": "Flavour Blend"}, {"levelthree_cate": "Dinner Beef"}, {"levelthree_cate": "Dinner Bolognaise"}, {"levelthree_cate": "Dinner Pasta"}, {"levelthree_cate": "Chicken Aioli Wrap"}, {"levelthree_cate": "Steak Wrap"}, {"levelthree_cate": "Promo Wraps"}, {"levelthree_cate": "1pc Chicken Skewer"}, {"levelthree_cate": "3pc Chicken Skewer"}, {"levelthree_cate": "Honey Soy Wrap"}, {"levelthree_cate": "Asian Salad"}, {"levelthree_cate": "Prem Warm Salad"}, {"levelthree_cate": "Chicken Bites Box"}, {"levelthree_cate": "Chicken Bites 8"}, {"levelthree_cate": "Chicken Southwest"}, {"levelthree_cate": "Mac & Cheese Bites"}, {"levelthree_cate": "Chai Latte"}, {"levelthree_cate": "Classic Chicken Salad"}, {"levelthree_cate": "Caesar Chicken Salad"}, {"levelthree_cate": "Vege Burger"}, {"levelthree_cate": "Foldover Chicken"}, {"levelthree_cate": "Roast Chicken Salad"}, {"levelthree_cate": "Crispy Chicken Salad"}, {"levelthree_cate": "Salted Caramel Pie"}, {"levelthree_cate": "Giant Freckle"}, {"levelthree_cate": "Sticky Date Pudding"}, {"levelthree_cate": "Chkn Spicy Jalapeno"}, {"levelthree_cate": "Gluten Free Torte"}, {"levelthree_cate": "Ronald Cookies"}, {"levelthree_cate": "Choc Pudding"}, {"levelthree_cate": "Steak & Chipotle Wrap"}, {"levelthree_cate": "Chicken Spicy Jalapeno Wrap"}, {"levelthree_cate": "Bak Swirl"}, {"levelthree_cate": "Bak Muffin"}, {"levelthree_cate": "Side Bacon Chees"}, {"levelthree_cate": "Side Bacon BBQ Onion"}, {"levelthree_cate": "Side Guac Salsa"}, {"levelthree_cate": "Angus Clubhouse"}, {"levelthree_cate": "Choc Bites"}, {"levelthree_cate": "Pie with Soft Serve"}, {"levelthree_cate": "Other Cake"}, {"levelthree_cate": "Breakfast bar"}, {"levelthree_cate": "Chocolate Ball"}, {"levelthree_cate": "Chorizo Wrap"}, {"levelthree_cate": "Mixed Berry Dessert"}, {"levelthree_cate": "Oatmeal"}, {"levelthree_cate": "BF Steak Wrap"}, {"levelthree_cate": "Steak Salad"}, {"levelthree_cate": "Thai Beef Salad"}, {"levelthree_cate": "Snack Wrap"}, {"levelthree_cate": "Hash Brown Bites 8"}, {"levelthree_cate": "Cheesy BBQ Bgr"}, {"levelthree_cate": "Fruit Parfait"}, {"levelthree_cate": "Choc Top Topping"}, {"levelthree_cate": "Banana Loaf"}, {"levelthree_cate": "Mega Filet-o-Fish"}, {"levelthree_cate": "Mega McChicken"}, {"levelthree_cate": "Biscuit"}, {"levelthree_cate": "AFL Bundle"}, {"levelthree_cate": "Firey Chicken Burger"}, {"levelthree_cate": "Chipotle Mayo"}, {"levelthree_cate": "Chicken Bacon Deluxe Bgr"}, {"levelthree_cate": "Southern BBQ"}, {"levelthree_cate": "Crispy Chicken Ogre Burger"}, {"levelthree_cate": "Seared Chicken Ogre Burger"}, {"levelthree_cate": "Filet-o-Fish Wrap"}, {"levelthree_cate": "Aussie Crispy Chkn Burger"}, {"levelthree_cate": "Aussie Seared Chkn Burger"}, {"levelthree_cate": "Chkn Bacon Deluxe"}, {"levelthree_cate": "Sourdough Toast"}, {"levelthree_cate": "Chorizo Saus Omelette"}, {"levelthree_cate": "Brekkie Sandwich"}, {"levelthree_cate": "Egg white Wrap"}, {"levelthree_cate": "Ham Egg Bun"}, {"levelthree_cate": "Green Tea"}, {"levelthree_cate": "Macchiato"}, {"levelthree_cate": "Flavoured Iced Mocha"}, {"levelthree_cate": "Flavoured Iced Latte"}, {"levelthree_cate": "Babycino"}, {"levelthree_cate": "Flavoured Coffee"}, {"levelthree_cate": "Cake Rolls Other"}, {"levelthree_cate": "Slices Cherry"}, {"levelthree_cate": "Fruit Loaf 2 Slice"}, {"levelthree_cate": "Friand Other"}, {"levelthree_cate": "Profiteroles"}, {"levelthree_cate": "Loaf"}, {"levelthree_cate": "Bak Danish"}, {"levelthree_cate": "Krispy Kreme Donuts"}, {"levelthree_cate": "Flavoured Mocha"}, {"levelthree_cate": "Chai"}, {"levelthree_cate": "Chorizo Roll"}, {"levelthree_cate": "Donuts Iced Other"}, {"levelthree_cate": "Affogato"}, {"levelthree_cate": "Cookies Other"}, {"levelthree_cate": "Quiche"}, {"levelthree_cate": "Chicken Cheese BBQ Burger"}, {"levelthree_cate": "Chicken Cheese S/Chil Burger"}, {"levelthree_cate": "Croissants Reg"}, {"levelthree_cate": "Bak Croissant"}, {"levelthree_cate": "Bak Scroll"}, {"levelthree_cate": "Bak Scroll Other"}, {"levelthree_cate": "Bak Croissant Other"}, {"levelthree_cate": "Bak Swirl Other"}, {"levelthree_cate": "Bakery"}, {"levelthree_cate": "Carrot Pecan Loaf"}, {"levelthree_cate": "Almond Orange Loaf"}, {"levelthree_cate": "Plated Breakfast"}, {"levelthree_cate": "Chicken Cheese Bacon Bgr"}, {"levelthree_cate": "Croissants"}, {"levelthree_cate": "Fries and Hotcakes"}, {"levelthree_cate": "Short Black"}, {"levelthree_cate": "Butter for KVS"}, {"levelthree_cate": "Party Cake"}, {"levelthree_cate": "Party Charge Std"}, {"levelthree_cate": "Party Charge Premium"}, {"levelthree_cate": "Happy Meal Toy"}, {"levelthree_cate": "Tumbler"}, {"levelthree_cate": "Newspaper"}, {"levelthree_cate": "Coke Glass"}, {"levelthree_cate": "Voucher"}, {"levelthree_cate": "Wrist Band"}, {"levelthree_cate": "Fire Hat"}, {"levelthree_cate": "Galaxy Ripple"}, {"levelthree_cate": "Snack"}, {"levelthree_cate": "Board Game"}, {"levelthree_cate": "Cooler Bag"}, {"levelthree_cate": "Big Book of Fun"}, {"levelthree_cate": "Sourdough Bread"}, {"levelthree_cate": "Cheese"}, {"levelthree_cate": "Lean Beef Patty"}, {"levelthree_cate": "Deluxe"}, {"levelthree_cate": "Mushrooms"}, {"levelthree_cate": "Sausage Patty"}, {"levelthree_cate": "Sugar"}, {"levelthree_cate": "Equal"}, {"levelthree_cate": "Premium Chicken"}, {"levelthree_cate": "Reg Chicken"}, {"levelthree_cate": "Dinner Rice"}, {"levelthree_cate": "Served in Cup"}, {"levelthree_cate": "Avocado"}, {"levelthree_cate": "Beef Patty 3:1"}, {"levelthree_cate": "Decaf Coffee"}, {"levelthree_cate": "Skim Milk"}, {"levelthree_cate": "Soy Milk"}, {"levelthree_cate": "Tea Bag"}, {"levelthree_cate": "Lamb Patty"}, {"levelthree_cate": "Seared Chicken Portion"}, {"levelthree_cate": "BBQ Chicken Burger"}, {"levelthree_cate": "Spicy Chicken Clubhouse"}, {"levelthree_cate": "Spicy Dbl McChicken"}, {"levelthree_cate": "McVeggie Burger"}, {"levelthree_cate": "Lactose free milk for coffee"}, {"levelthree_cate": "Veggie Patty"}, {"levelthree_cate": "Raspberry & Custard Pie"}, {"levelthree_cate": "Long Mac"}, {"levelthree_cate": "Slice"}, {"levelthree_cate": "Rocky Road"}, {"levelthree_cate": "Iced Long Black"}, {"levelthree_cate": "Dbl McChicken"}, {"levelthree_cate": "QTR P Bacon"}, {"levelthree_cate": "Spicy QTR P"}, {"levelthree_cate": "Beef El Maco"}, {"levelthree_cate": "Chicken El Maco Jalapeno"}, {"levelthree_cate": "Dbl Spicy QTR P"}, {"levelthree_cate": "Chicken El Maco"}, {"levelthree_cate": "Beef El Maco Jalapeno"}, {"levelthree_cate": "Lettuce"}, {"levelthree_cate": "Dbl QTR P Bacon"}, {"levelthree_cate": "Spicy QTR P Bacon"}, {"levelthree_cate": "GMA Offer"}, {"levelthree_cate": "Chicken Strips"}, {"levelthree_cate": "Deluxe Chicken Bites"}, {"levelthree_cate": "Chicken Spicy Snack Wrap"}, {"levelthree_cate": "Cone"}, {"levelthree_cate": "Aussie Angus"}, {"levelthree_cate": "Bites & Fries"}, {"levelthree_cate": "Breakfast Roll"}, {"levelthree_cate": "Yoghurt"}, {"levelthree_cate": "Nitro"}, {"levelthree_cate": "Fruit Bag"}, {"levelthree_cate": "Grape Tomatoes"}, {"levelthree_cate": "Tomato Bag"}, {"levelthree_cate": "NP6 Fries VM"}, {"levelthree_cate": "NP6 Fruit Bag HM"}, {"levelthree_cate": "Veggie El Maco"}, {"levelthree_cate": "Veggie El Maco Jalapeno"}, {"levelthree_cate": "Mozzarella Sticks"}, {"levelthree_cate": "Donut Balls"}, {"levelthree_cate": "Nuggets10"}, {"levelthree_cate": "Karaage Burger"}, {"levelthree_cate": "Parmi Burger"}]

        // for (var i = 0; i < temp_catep.length; i++) {
        //     this.ProductCat.push({
        //             prdid: i,
        //             prdtext: temp_catep[i].levelthree_cate
        //     });
                    
        //     }
        // this.metrixnote = " % Sales"
        // this.catmembers = this.ProductCat;
        // this.PrdCatmodelid=['Smoothie','Frappe','Sipahh Milk','Ice Break','Latte','Iced Coffee','Milk Shakes','Coffee (PRONTO)','Iced Mocha','Iced Chocolate','Apple Juice','Cold Drinks Other','Sparkling Jiuce','Milk','Iced Tea','Tea','Pot of Tea','Cappuccino','Flat White','Mocha','Long Black','Hot Chocolate','Espresso (PRONTO)','Chocolate Drinks','Calciyum','Juice','Flat white','Matcha Latte','Iced Lemonade','Add On Coffee','Iced Latte','Chocolate Coconut Latte','BIM Sampling','Chai Latte','Extra coffee','Fruit Based','McChiller','Espresso','Vienna','Green Tea','Macchiato','Flavoured Iced Mocha','Flavoured Iced Latte','Babycino','Plunger Tea','Soft Drink','Milk Based','Flavoured Coffee','Flavoured Mocha','Chai','Affogato','Short Black','Decaf Coffee','Nitro','Long Mac','Iced Long Black']
        // this.category_array=['Smoothie','Frappe','Sipahh Milk','Ice Break','Latte','Iced Coffee','Milk Shakes','Coffee (PRONTO)','Iced Mocha','Iced Chocolate','Apple Juice','Cold Drinks Other','Sparkling Jiuce','Milk','Iced Tea','Tea','Pot of Tea','Cappuccino','Flat White','Mocha','Long Black','Hot Chocolate','Espresso (PRONTO)','Chocolate Drinks','Calciyum','Juice','Flat white','Matcha Latte','Iced Lemonade','Add On Coffee','Iced Latte','Chocolate Coconut Latte','BIM Sampling','Chai Latte','Extra coffee','Fruit Based','McChiller','Espresso','Vienna','Green Tea','Macchiato','Flavoured Iced Mocha','Flavoured Iced Latte','Babycino','Plunger Tea','Soft Drink','Milk Based','Flavoured Coffee','Flavoured Mocha','Chai','Affogato','Short Black','Decaf Coffee','Nitro','Long Mac','Iced Long Black']
        // this.GetProducts()
        // this.model1 = {"year":parseInt("2018"),"month":parseInt("09"),"day":parseInt("15")}
        // this.model2 = {"year":parseInt("2019"),"month":parseInt("09"),"day":parseInt("7")}
        // this.duration_weekss = 52

        // Static code end here ---------------------------------------------

		if (this.arr2.length > 0) {
            this.Teststorelbl = true;
        } else {
            this.Teststorelbl = false;
        }
        for (let i = 0; i < this.AdvanceData.length; i++) {}

        setTimeout(() => {
            this.MatchResultsdata = this.MatchValues_DATA;
            this.MatchValuesDatasrc.sort = this.sort;
            this.StatResultsdata = this.Stat_Result_Data;
            this.StatValuesDatasrc.sort = this.sort;
            // this.Gethierarchy();
            this.GetProductcat(2);
        });

        for (var i = 0; i < 2; i++) {
            var enable = null;
        }

        this.uploadAdditionalFeat = this.formBuilder.group({
            upldfeat: ['']
        });

        this.ProductSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'Unselect All',
            itemsShowLimit: 1,
            enableCheckAll: true,
            allowSearchFilter: true
        };
        this.ProductCategorySettings = {
            singleSelection: false,
            idField: 'prdid',
            textField: 'prdtext',
            selectAllText: 'Select All',
            unSelectAllText: 'Unselect All',
            itemsShowLimit: 1,
            enableCheckAll: true,
            allowSearchFilter: true
        };    

        this.TestVscntrlSet = {
            singleSelection: false,
            idField: 'id',
            textField: 'text',
            selectAllText: 'Select All',
            unSelectAllText: 'Unselect All',
            itemsShowLimit: 1,
            enableCheckAll: true,
            allowSearchFilter: true
        };


        setTimeout(() => {
            this.MatchValuesDatasrc.sort = this.sort;
            this.AdvSettingDatasrc.sort = this.sort;
            this.Advancedsettingdata = this.AdvanceData;
        });

        var newMyObjectJSON = sessionStorage.getItem('w2index');
        var newMyObject = JSON.parse(newMyObjectJSON);
        if (sessionStorage.getItem('w2index') == null || newMyObject.w2stepval == 0) {
            this.stepindex = 0;
            $(document).ready(function() {
                $('li#3').removeClass('done');
                $('li#4').removeClass('done');
            });
        } else {
            this.stepindex = newMyObject.w2stepval;
            //this.isShow =true;
            // this.CompletedStep3 = true;
            // this.CompletedStep4 = true;
            // this.showcnt1 = false;
            // this.showcnt2 = false;
            // this.showcnt3 = true;
            // $(document).ready(function() {
            //   $('li#3').addClass('done');
            //   $('li#4').addClass('done');
            // });
            this.stepindex = 0;
            $(document).ready(function() {
                $('li#3').removeClass('done');
                $('li#4').removeClass('done');
            });
        }

        combineLatest(this.route.params, this.route.queryParams).pipe(map(results => ({
            params: results[0],
            query: results[1]
        }))).subscribe(results => {

            if(results)
               {
                   if(results.query)
                   {
                       if(results.query.trial)
                       {
                           this.wizard2service.LoadSavedTest(results.query.trial).subscribe((apiresponse: any) => {
                            if (apiresponse.status == 'ok') {
                            let parseData = JSON.parse(apiresponse.data.records[0].record_value)
                            let temp_id:any =[];
                            temp_id = "[" + parseData.select_store + "]"; 
                            localStorage.setItem('trial_name',parseData.test_name)
                            localStorage.setItem('teststoreids',temp_id)
                            localStorage.setItem('trial',apiresponse.data.test_id)
                            if(apiresponse.data.records.length>1)
                            {
                                this.temp_Datas = apiresponse.data.records[1]
                                this.temp_Datas = JSON.parse(this.temp_Datas.record_value)
                                this.loaddatas = true;
                                this.testmetricmodelid = this.temp_Datas.target_metric
                                this.hiermodelid = parseInt(this.temp_Datas.Hierarchy)
                                this.PrdCatmodelid = this.temp_Datas.prd_cat
                                this.product_array = this.temp_Datas.prd
                                let tempstart_Date = this.temp_Datas.Startdt.split("-")
                                this.model1 = {"year":parseInt(tempstart_Date[0]),"month":parseInt(tempstart_Date[1]),"day":parseInt(tempstart_Date[2])}
                                let tempend_Date = this.temp_Datas.Enddt.split("-")
                                this.model2 = {"year":parseInt(tempend_Date[0]),"month":parseInt(tempend_Date[1]),"day":parseInt(tempend_Date[2])}
                                this.duration_weekss = this.temp_Datas.duration_window
                            }


                       }
                   });
               }
            }
        }
    });

    this.wizard2service.GetDateRange().subscribe((apiresponse: any) => {
    if (apiresponse.status == 'ok') {
        let temp_startdate:any = moment(apiresponse.data.startdate).format("YYYY-MM-DD")
        temp_startdate = temp_startdate.split('-') 
        this.startmindate =  {"year":parseInt(temp_startdate[0]),"month":parseInt(temp_startdate[1]),"day":parseInt(temp_startdate[2])}
        let temp_startdate1:any = moment(apiresponse.data.enddate).format("YYYY-MM-DD")
        temp_startdate1 = temp_startdate1.split('-')
        this.endmindate =  {"year":parseInt(temp_startdate1[0]),"month":parseInt(temp_startdate1[1]),"day":parseInt(temp_startdate1[2])}
        
    }    
    });
    let getback:any = localStorage.getItem('backto')
    
    if(getback=='5')
    {
    setTimeout(() => {
        this.chnages()
    },1000)


    }
    }

    chnages()
    {        
     this.wizard.goToNextStep();
     this.CompletedStep3 = true;
     setTimeout(() => {
        this.schnage1()
    },1000)

    }

    schnage1()
    {
        this.showcnt1 =false
        this.showcnt3 = false
        this.showcnt3 =true
        this.CompletedStep4 =true;
        this.wizard.goToNextStep();
        this.movetostp4_saved()
        this.movetostp5_saved()
        localStorage.removeItem('backto')
    }
    

    /*API FOR HIER,PRODUCTCAT,PRODUCTS*/
    Gethierarchy() {
        this.wizard2service.GetHierachy().subscribe((apiresponse: any) => {
            if (apiresponse.status == 'ok') {
                for (var i = 0; i < apiresponse.data.length; i++) {
                    this.hierarchy.push(apiresponse.data[i]);
                }
            }
        });
    }

    GetProductcat(hier: any) {
        var market_id = localStorage.getItem('market_id');

        let data: any = {
            hierarchy_id: hier,
            market_id: 1
        };
        this.hierlvl = hier;
        this.catmembers = [];
        this.ProductCat = [];
        this.PrdCatmodelid = [];
        this.prductmembers = [];
		this.categorycount = 0;

        this.wizard2service.GetProductCat(data).subscribe((apiresponse: any) => {
            if (apiresponse.status == 'ok') {
                for (var i = 0; i < apiresponse.data.length; i++) {
                    if (data.hierarchy_id == 1) {
                        this.ProductCat.push({
                            prdid: i,
                            prdtext: apiresponse.data[i].levelone_cate
                        });
                    }
                    if (data.hierarchy_id == 2) {
                        this.ProductCat.push({
                            prdid: i,
                            prdtext: apiresponse.data[i].leveltwo_cate
                        });
                    }
                    if (data.hierarchy_id == 3) {
                        this.ProductCat.push({
                            prdid: i,
                            prdtext: apiresponse.data[i].levelthree_cate
                        });
                    }
                    if (data.hierarchy_id == 4) {
                        this.ProductCat.push({
                            prdid: i,
                            prdtext: apiresponse.data[i].levelfour_cate
                        });
                    }
                }
                this.catmembers = this.ProductCat;
                this.catmembers = this.catmembers.sort()


            } else {
                this.toastr.warning('', 'Can`t able to load Category');
            }
        });
    }

    //   create2() {
    //   this._notificationsService.error('Warning',"Features are expected for  981 stores, but are available only for 980  stores.", {timeOut: 0});
    //

    GetProducts() {

        var market_id = localStorage.getItem('market_id');

        let val: any = {
            //hierarchy_id: this.hierlvl,
            hierarchy_id: 2,
            market_id: 1,
            category_desc: this.category_array
        };
        //this.prductmembers=[];
        this.ProductList = [];
		this.productcount = 0;
        this.wizard2service.GetProducts(val).subscribe((apiresponse: any) => {
            if (apiresponse.status == 'ok') {
                for (var i = 0; i < apiresponse.data.length; i++) {
                    this.ProductList.push(
                        //item_id: apiresponse.data[i].pro_id,
                        apiresponse.data[i].menu_item_desc
                    );
                }
                this.prductmembers = this.ProductList;
				if(this.ProductList.length>0)
				{
					this.noteshow = true;
					this.productcount = this.ProductList.length
                    if(this.ProductList.length==1)
                        this.products_text = "Product"
                    else
                        this.products_text = "Products"
					this.categorycount = this.category_array.length
                    if(this.category_array.length==1)
                        this.category_text = "Category"
                    else
                        this.category_text = "Categories"
				}
				else
				{
					this.noteshow = false;
				}

                this.product_array = this.ProductList;
                if (this.product_array != '') {
                    this.prd_req = true;
                } else {
                    this.prd_req = false;
                }
            }
        });
    }

    GetConsideredFeatures() {
        var market_id = localStorage.getItem('market_id');
        let val: any = {
            market_id: 1
        };
        this.wizard2service.GetConsideredFeatures(val).subscribe((apiresponse: any) => {
            if (apiresponse.status == 'ok') {
                let temp_tree: any = [];
                for (let i = 0; i < apiresponse.data.length; i++) {
                    var childarry = [];
                    var name = apiresponse.data[i].feat_name;
                    for (let j = 0; j < apiresponse.data[i].feature_list.length; j++) {
                        childarry.push({
                            feat_name: apiresponse.data[i].feature_list[j].feature_name
                        });
                    }

                    temp_tree.push({
                        feat_name: name,
                        children: childarry
                    });
                }

                this.TREE_DATA = temp_tree;
                this.TreeSource.data = this.TREE_DATA;
            }
        });
    }

    /*API FOR HIER,PRODUCTCAT,PRODUCTS*/
    HierSelect(hier: any) {
        if (this.hiermodelid != '') {
            this.hier_req = true;
        } else {
            this.hier_req = false;
        }
        this.product_array = [];
		this.noteshow = false;
        this.GetProductcat(hier);
    }
    onCatSelect(categories: any) {
        if (this.PrdCatmodelid != '') {
            this.prdcat_req = true;
        } else {
            this.prdcat_req = false;
        }

        //if(this.category_array.indexOf(this.category_array.prdtext) === -1) {

        this.category_array.push(categories.prdtext);
        //}

        this.GetProducts();
    }

    onCatDeSelect(categories: any) {

        this.category_array = this.category_array.filter(function(e: any) {
            return e !== categories.prdtext;
        });
        this.GetProducts();
    }

    onPrdDeSelect(products: any) {
        this.product_array = this.product_array.filter(function(e: any) {
            return e !== products;
        });
        this.productcount = this.product_array.length
    }

    
    onCatSelectAll(categories:any)
    {
        this.category_array = []
        for (var i = categories.length - 1; i >= 0; i--) {
        this.category_array.push(categories[i].prdtext);    
        }
        
        setTimeout(()=>{
            this.GetProducts()
        },500)

    }

    onCatDeSelectAll()
    {        
        this.category_array =[]
        this.GetProducts()
    }

    onPrdSelect(products: any) {

        this.product_array.push(products.item_text);
        this.productcount = this.product_array.length
    }

    onPrdSelectAll(allproducts: any) {

        this.product_array = []
        for (var i = allproducts.length - 1; i >= 0; i--) {
        this.product_array.push(allproducts[i].item_text);    
        }
        this.productcount = this.product_array.length
    }

    onPrdDeSelectAll()
    {
        this.product_array=[]
        this.productcount = 0

    }

    featuresample()
    {
        window.location.href = environment.ExcelPath + "additional_features.xlsx"
    }

    excludesample()
    {
     window.location.href = environment.ExcelPath + "control_store_to_exclude.xlsx"   
    }
    /*-------------------Pagination------------------------*/
    paginatestore(event: any) {
        this.pageIndex = event;
        this.Advancedsettingdata = this.AdvanceData.slice(event * this.size - this.size, event * this.size);
    }

    paginatematchvals(event: any) {
        this.pageIndex = event;
        this.MatchResultsdata = this.MatchValues_DATA.slice(
            event * this.match_vals_size - this.match_vals_size,
            event * this.match_vals_size
        );
    }

    paginatestatvals(event: any) {
        this.pageIndex = event;
        this.StatResultsdata = this.Stat_Result_Data.slice(
            event * this.stat_vals_size - this.stat_vals_size,
            event * this.stat_vals_size
        );
    }

    /*-------------------Pagination------------------------*/
    perpageStore(event: any) {
        this.size = event.target.value;
        this.ap = 1;
        this.Perpagerefresh();
    }

    perpageMatchVals(event: any) {
        this.match_vals_size = event.target.value;
        this.mp = 1;
        this.Perpagerefresh();
    }

    perpageStatVals(event: any) {
        this.stat_vals_size = event.target.value;
        this.Perpagerefresh();
    }

    Perpagerefresh() {
        setTimeout(() => {
            this.AdvSettingDatasrc.sort = this.sort;
            this.Advancedsettingdata = this.AdvanceData;
            this.MatchResultsdata = this.MatchValues_DATA;
            this.MatchValuesDatasrc.sort = this.sort;
            this.StatResultsdata = this.Stat_Result_Data;
            this.StatValuesDatasrc.sort = this.sort;
        });
    }
    /*Wizard Navigations*/
    MoveToWizard1(val:any) {
        
        var myObject = {
            w2stepval: 2
        };
        var myObjectJson = JSON.stringify(myObject);
        sessionStorage.setItem('w2index', myObjectJson);


        localStorage.setItem('backto','3')
        let trial_name =  localStorage.getItem('trial_name')
           let navigationExtras = {
                queryParams: {
                    "trial": trial_name,                           
                }
            };
            this.router.navigate(['./testconfig'],navigationExtras);
       
    }

    Resetanalysis()
    {
        this.testmetricmodelid = ''
        this.noteshow = false
        this.hiermodelid =""
        this.target_metric_req =false
        this.PrdCatmodelid = ""
        this.model1 = null
        this.model2 = null
        this.categorycount =0;
        this.metrixnote =""
        this.productcount = 0;
        this.category_array= []
        this.product_array = []
        this.days = 0
        this.featurevalue =""
        this.myFiles1=[]

    }
    movebcktostp3() {
        this.wizard.goToPreviousStep();
        this.showcnt1 = true;
        this.showcnt2 = false;
        this.showcnt3 = false;
        this.CompletedStep3 = false;
        this._snackBar.dismiss();
        this.submit_visible = true;
        this.featurevalue = '';
        this.submitcntrl_visible = true;
        this.file_exclude = '';
    }

    movebcktostp4() {
        this.wizard.goToPreviousStep();
        this.showcnt1 = false;
        this.showcnt2 = true;
        this.showcnt3 = false;
        this.CompletedStep4 = false;

        this.currentres = true;
        this.currentvr = false;
        this.currentssr = false;
        this.show_match_results = true;
        this.show_visualize_results = true;
        this.show_statistical_results = false;
        this.arr2 = [];
        this.vistest_modelid = [];
        this.Teststorelbl = false;
        this._snackBar.dismiss();
    }

    getFlooredFixed(v: any, d: any) {
        return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    }
    MetricSelect(metric: any) {
        if (this.testmetricmodelid != '') {
            this.target_metric_req = true;            
			if(this.testmetricmodelid == 1)
				this.metrixnote = "Wt Avg Price"
			else
				this.metrixnote = "% Sales contribution"
        } else {
            this.target_metric_req = false;
        }
    }
    inputcheck() {
        if (this.no_of_cntrl) {
            this.n_control_required = false;
        }
    }

    movetostp4() {
        if (this.model1) {
            this.stdate = this.model1.year + '-' + this.model1.month + '-' + this.model1.day;
        }
        if (this.model2) {
            this.enddate = this.model2.year + '-' + this.model2.month + '-' + this.model2.day;
        }

        var storeids = JSON.parse(localStorage.getItem('teststoreids'));
        var trial = localStorage.getItem('trial');

        var teststoreids = localStorage.getItem('teststoreids');
        var storeidarray = JSON.parse(teststoreids);

        this._snackBar.dismiss();
        var strArr:any = [];
        for (var itr = 0; itr < storeidarray.length; itr++) {
            strArr[itr] = '' + storeidarray[itr];
        }
        this.AdvanceData = [];
        this.AdvSettingDatasrc = new MatTableDataSource < any > (this.AdvanceData);
        this.selection = new SelectionModel < AdvSettingvalues > (true, []);
        this.selectionstate = new SelectionModel < AdvSettingvalues > (true, []);
        this.selectionstoretype = new SelectionModel < AdvSettingvalues > (true, []);
        this.selectionlocality = new SelectionModel < AdvSettingvalues > (true, []);

        // for (var i = 0; i < storeidarray.length; i++) {
        //     this.AdvanceData.push({
        //         'TestStore': strArr[i]
        //     });
        // }
        // this.Advancedsettingdata = this.AdvanceData;
        this.items = [];
        var hierarchy = {
            //lvl: this.hiermodelid,
            lvl: "2",
            categories: this.category_array
            // categorie: this.sample_array
        };

        
        if (this.Additional_Features_data == null)
        {
            this.Additional_Features_data = null
        }
        else
        {
            let tempe:any = JSON.parse(this.Additional_Features_data)
            this.Additional_Features_data = JSON.stringify(tempe).replace(/\:null/gi, "\:\"\"") 
        }       

        let data: any = {
            trial: "trial_" + trial.toString(),
            teststores: strArr,
            metric: this.testmetricmodelid,
            startDate: this.stdate,
            endDate: this.enddate,
            hierarchy: hierarchy,
            //categories: categorie,
            filename: this.featurevalue,
            itemList: this.product_array,
            additional_features: this.highlight_additionlfeat,
            extraFeatures: this.Additional_Features_data
        };
        if ((this.testmetricmodelid != '')) {
            this.target_metric_req = true;
        } 
        else if (this.testmetricmodelid==null) {
            this.target_metric_req = false
        }
        else {
            this.target_metric_req = false;
        }

        if (this.hiermodelid != '') {
            this.hier_req = true;
        } else {
            this.hier_req = false;
        }
        if (this.PrdCatmodelid != '') {
            this.prdcat_req = true;
        } else {
            this.prdcat_req = false;
        }
        if (this.product_array != '') {
            this.prd_req = true;
        } else {
            this.prd_req = false;
        }
        
        if (this.stdate) {
            this.startdt_req = true;
        } else {
            this.startdt_req = false;
        }

        if (this.enddate) {
            this.enddt_req = true;
        } else {
            this.enddt_req = false;
        }

        // this.seleceted=['name1','name2','name3','name4','name5'];
        // this.unselected =['name6','name7','name8','name9','name10'];
        // this.unselected_const =['name6','name7','name8','name9','name10'];
        // this.highlight_additionlfeat =['name6','name1','name4'];

        // this.wizard.goToNextStep();
        // this.showcnt1 = false;
        // this.showcnt2 = true;
        // this.showcnt3 = false;
        // this.CompletedStep3 = true;
    
        if (
            this.testmetricmodelid &&
            this.prdcat_req &&
            this.prd_req &&
            this.startdt_req &&
            this.enddt_req &&
            this.date_valid
        ) {
            this.wizard2service.AnalyzeFeatures(data).subscribe((apiresponse: any) => {
                if (apiresponse.status == 'ok') {
                    localStorage.setItem('Startdate',this.stdate)
                    localStorage.setItem('Enddate',this.enddate)
                    this.wizard.goToNextStep();
                    this.showcnt1 = false;
                    this.showcnt2 = true;
                    this.showcnt3 = false;
                    this.CompletedStep3 = true;

                    let temp_selected:any;
                    this.seleceted =[]                    
                    temp_selected = JSON.parse(apiresponse.features)
                    for (i=0 ;i<=temp_selected.length-1;i++)
                    {
                        this.seleceted.push(temp_selected[i].features)
                    }
                    
                    this.unselected = apiresponse.additional_features;
                    this.unselected_const = apiresponse.additional_features;
                    this.working_teststores = apiresponse.teststores;
                    
                    
                    this.AdvanceData =[]
                    for (var i = 0; i < this.working_teststores.length; i++) {
                        this.AdvanceData.push({
                            'TestStore': strArr[i]
                        });
                    }
                    this.Advancedsettingdata = this.AdvanceData;
                    this.AdvSettingDatasrc.data  = this.AdvanceData;
                    
                    let temp:any =[]
                    for (var i = 0;i<= apiresponse.teststores.length-1; i++) {
                        temp.push(parseInt(apiresponse.teststores[i]))
                    }
                    
                    temp.sort((a:any,b:any) => 0 - (a > b ? -1 : 1));
                    let temp_teststore:any =[]
                    for (var i = 0; i <= temp.length -1; i++) {
                        temp_teststore.push({
                        "id": temp[i],
                        "text": temp[i] 
                    });
                    }

                    this.testvscntrl_teststore = temp_teststore;
                    this.testvscntrl_testr1  = temp_teststore;

                    // this.highlight_additionlfeat = [];
                    this.adjustedval = this.getFlooredFixed(apiresponse.rSquared, 3);
                    this.analystringify = apiresponse
                    
                    this.duration_weekss = this.days

                }
                else
                {
                     var action = 'close';
                        this._snackBar.open(apiresponse.data, action, {
                            duration: 10000,
                            verticalPosition: 'bottom'
                        });   
                }
            });
        }
    }
    movetostp4_saved()
    {
        this.ngxService.start();
                
        this.wizard.goToNextStep();
        this.showcnt1 = false;
        this.showcnt2 = true;
        this.showcnt3 = false;
        this.CompletedStep3 = true;
        this.seleceted = this.temp_Datas.selected_feat;
        this.unselected = this.temp_Datas.unselected_feat;
        // this.unselected_const = apiresponse.additional_features;
        this.adjustedval = this.temp_Datas.adjusted_r_squared
        this.no_of_cntrl = this.temp_Datas.no_of_cntrl
        this.ngxService.stop();            

    }
    chosenItems(selecteditems: any) {
        this.selectedToAdd = selecteditems;
        console.log(this.selectedToAdd );
    }
    onChangeselfeat($event: any, chosenitems: any) {
        console.log(chosenitems);
        if (chosenitems.length > 0 && this.selectedToAdd.length > 0) {
            this.movedisable = false;
            this.selstatus = true;
        } else {
            this.movedisable = true;
            this.selstatus = false;
        }
    }

    moveitems() {
        
        for (var i = 0 ; i <= this.selectedToAdd.length -1 ; i++) {

            if(this.highlight_additionlfeat.includes(this.selectedToAdd[i])>0)
            {
                var index = this.highlight_additionlfeat.indexOf(this.selectedToAdd[i]);                
                if (index !== -1) this.highlight_additionlfeat.splice(index, 1);
            }   
        };


        this.unselected = this.unselected.concat(this.selectedToAdd);
        
        for (var i = 0; i < this.selectedToAdd.length; i++) {
            this.unselected_const.push(this.selectedToAdd[i]);
        }

        var tempsel:any =[]
        for (var i =0 ; i <= this.seleceted.length -1; i++)
        {
            if(this.selectedToAdd.includes(this.seleceted[i]))
            {
                
            }
            else
            {      
                tempsel.push(this.seleceted[i])
            }
        }
        
        this.seleceted = tempsel
        
        this.selectedToAdd = [];

        if (this.seleceted.length > 0 && this.selectedToAdd.length > 0) {
            this.movedisable = false;
            this.selstatus = true;
        } else {
            this.movedisable = true;
            this.selstatus = false;
        }
    }
    v(selecteditems: any) {
        this.selectedToRemove = selecteditems;
    }

    onChangeunselfeat($event: any, chosenunselitems: any) {
        if (chosenunselitems.length > 0 && this.selectedToRemove.length > 0) {
            this.removedisable = false;
            this.unselstatus = true;
        } else {
            this.removedisable = true;
            this.unselstatus = false;
        }
    }
    removeitems() {

        for (var i = 0 ; i <= this.selectedToRemove.length -1 ; i++) {
            this.highlight_additionlfeat.push(this.selectedToRemove[i])    
        };
        
        this.seleceted = this.seleceted.concat(this.selectedToRemove);    

        this.unselected = this.unselected.filter((myitems: any) => {
            return this.seleceted.indexOf(myitems) < 0;
        });

        this.unselected_const = this.unselected_const.filter((myitems: any) => {
            return this.seleceted.indexOf(myitems) < 0;
        });

        var index = this.unselected_const.indexOf(this.selectedToRemove);
        if (index !== -1) this.unselected_const.splice(index, 1);

        this.selectedToRemove = [];

        if (this.unselected.length > 0 && this.selectedToRemove.length > 0) {
            this.removedisable = false;
            this.unselstatus = true;
        } else {
            this.removedisable = true;
            this.unselstatus = false;
        }
    }

    FilterUnselectedFeatures(event: string) {
        const val = event.toLowerCase();
        this.tempFilter = this.unselected_const;
        let temp_array: any = [];
        if (val != '') {
            const temp = this.tempFilter.filter(function(d: any) {
                return (
                    d
                    .toString()
                    .toLowerCase()
                    .indexOf(val) !== -1 || !val
                );
            });
            temp_array = temp;
        } else {
            temp_array = this.unselected_const;
        }
        this.unselected = temp_array;
    }
    tooltip() {}

    Filterdatafor_Testore(salesdata: any) {
        this.parse_sales_data = salesdata;
        var resArr: any = [];

        const map = new Map();
        for (const item of this.parse_sales_data) {
            if (!map.has(item.testStores)) {
                map.set(item.testStores, true);
                resArr.push({
                    id: item.testStores,
                    name: item.testStores
                });
            }
        }

        this.VisResTeststr = resArr;
        return this.VisResTeststr;
    }

    GetChartdata(teststoreid: any, salesdata: any) {
        const groupBy = (key: any) => (array: any) =>
            array.reduce((objectsByKeyValue: any, obj: any) => {
                const value = obj[key];
                objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                return objectsByKeyValue;
            }, {});

        var chart_arr = salesdata;
        const groupByTest = groupBy('testStores');
        var Chart_results = groupByTest(chart_arr);
        var chartkeys: any = Object.keys(Chart_results);
        var chartlen = chartkeys.length;
        var Final_Chart: any = [];
        var teststores_sales = []


        if (this.no_of_cntrl == 1) {
            var temp_controlstore1 = []


            for (var i = 0; i <= Chart_results[teststoreid].length - 1; i++) {
                this.weekendDate.push(moment(Chart_results[teststoreid][i].wkEndDate).format("DDMMMYYYY"))
                teststores_sales.push(Chart_results[teststoreid][i].sales)
                temp_controlstore1.push(Chart_results[teststoreid][i].controlSales_1)
            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })



        }

        if (this.no_of_cntrl == 2) {
            var temp_controlstore1 = [];
            var temp_controlstore2 = [];

            for (var i = 0; i <= Chart_results[teststoreid].length - 1; i++) {
                this.weekendDate.push(moment(Chart_results[teststoreid][i].wkEndDate).format("DDMMMYYYY"))
                teststores_sales.push(Chart_results[teststoreid][i].sales)
                temp_controlstore1.push(Chart_results[teststoreid][i].controlSales_1)
                temp_controlstore2.push(Chart_results[teststoreid][i].controlSales_2)
            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_2 + " (Control Store 2)",
                "data": temp_controlstore2,
                "color": '#69d420'
            })

        }

        if (this.no_of_cntrl == 3) {
            var temp_controlstore1 = [];
            var temp_controlstore2 = [];
            var temp_controlstore3 = [];


            for (var i = 0; i <= Chart_results[teststoreid].length - 1; i++) {
                this.weekendDate.push(moment(Chart_results[teststoreid][i].wkEndDate).format("DDMMMYYYY"))
                teststores_sales.push(Chart_results[teststoreid][i].sales)
                temp_controlstore1.push(Chart_results[teststoreid][i].controlSales_1)
                temp_controlstore2.push(Chart_results[teststoreid][i].controlSales_2)
                temp_controlstore3.push(Chart_results[teststoreid][i].controlSales_3)

            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_2 + " (Control Store 2)",
                "data": temp_controlstore2,
                "color": '#69d420'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_3 + " (Control Store 3)",
                "data": temp_controlstore3,
                "color": '#c128f6'
            })

        }

        if (this.no_of_cntrl == 4) {
            var temp_controlstore1 = [];
            var temp_controlstore2 = [];
            var temp_controlstore3 = [];
            var temp_controlstore4 = [];



            for (var i = 0; i <= Chart_results[teststoreid].length - 1; i++) {
                this.weekendDate.push(moment(Chart_results[teststoreid][i].wkEndDate).format("DDMMMYYYY"))
                teststores_sales.push(Chart_results[teststoreid][i].sales)
                temp_controlstore1.push(Chart_results[teststoreid][i].controlSales_1)
                temp_controlstore2.push(Chart_results[teststoreid][i].controlSales_2)
                temp_controlstore3.push(Chart_results[teststoreid][i].controlSales_3)
                temp_controlstore4.push(Chart_results[teststoreid][i].controlSales_4)

            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_2 + " (Control Store 2)",
                "data": temp_controlstore2,
                "color": '#69d420'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_3 + " (Control Store 3)",
                "data": temp_controlstore3,
                "color": '#c128f6'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_4 + " (Control Store 4)",
                "data": temp_controlstore4,
                "color": '#f4ff45'
            })

        }
        if (this.no_of_cntrl == 5) {
            var temp_controlstore1 = [];
            var temp_controlstore2 = [];
            var temp_controlstore3 = [];
            var temp_controlstore4 = [];
            var temp_controlstore5 = [];




            for (var i = 0; i <= Chart_results[teststoreid].length - 1; i++) {
                this.weekendDate.push(moment(Chart_results[teststoreid][i].wkEndDate).format("DDMMMYYYY"))
                teststores_sales.push(Chart_results[teststoreid][i].sales)
                temp_controlstore1.push(Chart_results[teststoreid][i].controlSales_1)
                temp_controlstore2.push(Chart_results[teststoreid][i].controlSales_2)
                temp_controlstore3.push(Chart_results[teststoreid][i].controlSales_3)
                temp_controlstore4.push(Chart_results[teststoreid][i].controlSales_4)
                temp_controlstore5.push(Chart_results[teststoreid][i].controlSales_5)

            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_2 + " (Control Store 2)",
                "data": temp_controlstore2,
                "color": '#69d420'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_3 + " (Control Store 3)",
                "data": temp_controlstore3,
                "color": '#c128f6'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_4 + " (Control Store 4)",
                "data": temp_controlstore4,
                "color": '#f4ff45'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].control_5 + " (Control Store 5)",
                "data": temp_controlstore5,
                "color": '#009999'
            })
        }


        this.arr2 = Final_Chart
    }

    movetostp5() {
        setTimeout(() => {
            this.MatchResultsdata = this.MatchValues_DATA;
            this.MatchValuesDatasrc.sort = this.sort;
        });
        var trial = localStorage.getItem('trial');
        this._snackBar.dismiss();

        var teststoreids = localStorage.getItem('teststoreids');
        var storeidarray = JSON.parse(teststoreids);
        var strArr = [];
        var constrain_arr = [];
        this.adv_teststoreobj = [];

        if(this.seleceted.length==0)
        {
            var action = 'close';
                        this._snackBar.open("Features must be selected for identifying similar control stores", action, {
                            duration: 10000,
                            verticalPosition: 'bottom'
                        });
            return;
        }
        for (var i = 0; i < this.adv_teststore_id.length; i++) {
            this.adv_teststoreobj.push({
                "storeID": this.adv_teststore_id[i].TestStore,
                "state": this.adv_teststore_id[i].State,
                "store_type": this.adv_teststore_id[i].StoreType,
                "locality_description": this.adv_teststore_id[i].Locality
            });
        }
        for (var itr = 0; itr < storeidarray.length; itr++) {
            strArr[itr] = '' + storeidarray[itr];
            if (this.adv_teststoreobj.find((x: any) => x.storeID == storeidarray[itr])) {} else {
                constrain_arr.push({
                    "storeID": strArr[itr],
                    "state": null,
                    "store_type": null,
                    "locality_description": null
                });
            }
        }
        this.final_settings = this.adv_teststoreobj.concat(constrain_arr)
        var teststoreids = localStorage.getItem('teststoreids');
        var storeidarray = JSON.parse(teststoreids);
        var strArr = [];
        for (var itr = 0; itr < storeidarray.length; itr++) {
            strArr[itr] = '' + storeidarray[itr];
        }

        this.adv_teststoreobj = [];
        for (var i = 0; i < this.adv_teststore_id.length; i++) {
            this.adv_teststoreobj.push({
                "storeID": this.adv_teststore_id[i].TestStore,
                "state": this.adv_teststore_id[i].State,
                "store_type": this.adv_teststore_id[i].StoreType,
                "locality_description": this.adv_teststore_id[i].Locality
            });
        }

        let data: any = {
            trial: "trial_" + trial.toString(),
            teststores: strArr,
            n_controls: parseInt(this.no_of_cntrl),
            settings: null,
            excludeControls: this.Excluecontrolstore,
            selectedFeatures: this.seleceted,
            advance_setting: this.final_settings
        };
        if (this.no_of_cntrl) {
            this.n_control_required = false;
            this.showcnt1 = false;
            this.showcnt2 = false;
            this.showcnt3 = true;
            this.CompletedStep4 = true;
        } else {
            this.n_control_required = true;
        }

        if (this.n_control_required == false && this.no_of_cntrl) {
            this.wizard2service.Identifyctrlstore(data).subscribe((apiresponse: any) => {
                if (apiresponse.status == "ok" && apiresponse.data != '') {
                    this.wizard.goToNextStep();

                    this.parse_sales_data = JSON.parse(apiresponse.data.sales);

                    var resArr: any = [];
                    this.controlstringify = apiresponse
                    this.Filterdatafor_Testore(this.parse_sales_data);
                    this.vistest_modelid = this.VisResTeststr[0].id;
                    this.arr2 = [];
                    this.GetChartdata(this.vistest_modelid, this.parse_sales_data)



                    /*Match Value result*/
                    const groupBy = (key: any) => (array: any) =>
                        array.reduce((objectsByKeyValue: any, obj: any) => {
                            const value = obj[key];
                            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                            return objectsByKeyValue;
                        }, {});
                    var getmatcharr = JSON.parse(apiresponse.data.matches);
					this.reportcolumns = apiresponse.data.columns;
					this.reportdata    = JSON.parse(apiresponse.data.matches)
					const groupByBrand = groupBy('testStores');
                    var Match_results = groupByBrand(getmatcharr);
                    var matchkeys: any = Object.keys(Match_results);
                    var matchlen = matchkeys.length
                    var Final_Match: any = []
                    for (var i = 0; i <= matchlen - 1; i++) {
                        var temp_ctrl = []
                        var temp_simi = []
                        var temp_salescorrs = []
                        var temp_ctrlid = []
                        for (var j = 0; j <= Match_results[matchkeys[i]].length - 1; j++) {
                            if (Match_results[matchkeys[i]][j].controlStores) {
                                temp_ctrl.push(Match_results[matchkeys[i]][j].controlStores)
                                temp_simi.push(Match_results[matchkeys[i]][j].similarity)
                                temp_salescorrs.push(Match_results[matchkeys[i]][j].salesCorrelation)
                            }
                        }
                        Final_Match.push({
                            "TestStore": Match_results[matchkeys[i]][0].testStores,
                            "Controlstore": temp_ctrl,
                            "Similarval": temp_simi,
                            "Salescorrelation": temp_salescorrs
                        })

                    }

                    this.MatchValues_DATA = Final_Match;
                    this.MatchResultsdata = Final_Match;
                    this.Fulltablevalue = Final_Match
                    // for(var i=0;i< 100;i++)
                    // {
                    //  match_arr.push({'TestStore':this.identify_cntrl.matches[i].teststore,'Controlstore':this.identify_cntrl.matches[i].control_store,
                    // 'Similarval':this.identify_cntrl.matches[i].similarity,'Salescorrelation':this.identify_cntrl.matches.salesCorrelation});
                    // }
                    // console.log(match_arr);
                    /*Match Value result*/
                    /*Statistical result*/
                    var varobj = Object.keys(apiresponse.data.metric.features);
                    var varkeys = Object.keys(varobj);
                    var varlen = varkeys.length
                    var stat_arr: any = [];

                    if (this.no_of_cntrl == 1) {
                        this.displayedColsStatrslts = ['VariableName', 'PValue'];
                    }
                    if (this.no_of_cntrl == 2) {
                        this.displayedColsStatrslts = ['VariableName', 'PValue', 'PValue1'];
                    }
                    if (this.no_of_cntrl == 3) {
                        this.displayedColsStatrslts = ['VariableName', 'PValue', 'PValue1', 'PValue2'];
                    }
                    if (this.no_of_cntrl == 4) {
                        this.displayedColsStatrslts = ['VariableName', 'PValue', 'PValue1', 'PValue2', 'PValue3'];
                    }
                    if (this.no_of_cntrl == 5) {
                        this.displayedColsStatrslts = ['VariableName', 'PValue', 'PValue1', 'PValue2', 'PValue3', 'PValue4'];
                    }
                    for (var i = 0; i < varlen; i++) {

                        if (this.no_of_cntrl == 1) {
                            stat_arr.push({
                                'VariableName': apiresponse.data.metric.features[i],
                                'control_1': apiresponse.data.metric.control_1[i]
                            });
                        } else if (this.no_of_cntrl == 2) {
                            stat_arr.push({
                                'VariableName': apiresponse.data.metric.features[i],
                                'control_1': apiresponse.data.metric.control_1[i],
                                'control_2': apiresponse.data.metric.control_2[i]
                            });
                        } else if (this.no_of_cntrl == 3) {
                            stat_arr.push({
                                'VariableName': apiresponse.data.metric.features[i],
                                'control_1': apiresponse.data.metric.control_1[i],
                                'control_2': apiresponse.data.metric.control_2[i],
                                'control_3': apiresponse.data.metric.control_3[i]
                            });
                        } else if (this.no_of_cntrl == 4) {
                            stat_arr.push({
                                'VariableName': apiresponse.data.metric.features[i],
                                'control_1': apiresponse.data.metric.control_1[i],
                                'control_2': apiresponse.data.metric.control_2[i],
                                'control_3': apiresponse.data.metric.control_3[i],
                                'control_4': apiresponse.data.metric.control_4[i]
                            });
                        } else if (this.no_of_cntrl == 5) {
                            stat_arr.push({
                                'VariableName': apiresponse.data.metric.features[i],
                                'control_1': apiresponse.data.metric.control_1[i],
                                'control_2': apiresponse.data.metric.control_2[i],
                                'control_3': apiresponse.data.metric.control_3[i],
                                'control_4': apiresponse.data.metric.control_4[i],
                                'control_5': apiresponse.data.metric.control_5[i]
                            });
                        }
                    }
                    this.StatResultsdata = stat_arr;
                    this.Stat_Result_Data = stat_arr;
                    /*Statistical result*/
                }
            });
        }
    }

     ontestSelecttable(event:any)
    { 
        let temp_lift:any = []; 
        for (var i = 0; i <= this.Fulltablevalue.length - 1; i++) {
                if (this.testvscntrl_testr1.find((x: any) => x.id == this.Fulltablevalue[i].TestStore)) {
                    temp_lift.push({
                             "TestStore": this.Fulltablevalue[i].TestStore,
                            "Controlstore": this.Fulltablevalue[i].Controlstore,
                            "Similarval": this.Fulltablevalue[i].Similarval,
                            "Salescorrelation": this.Fulltablevalue[i].Salescorrelation                      
                        })
                }
            }

            this.MatchValues_DATA = temp_lift;
            this.MatchResultsdata = temp_lift;
    }


    ontestDeSelecttable(event:any)
    {    
        let temp_lift:any = []; 
        for (var i = 0; i <= this.Fulltablevalue.length - 1; i++) {
                if (this.testvscntrl_testr1.find((x: any) => x.id == this.Fulltablevalue[i].TestStore)) {
                    temp_lift.push({
                        "TestStore": this.Fulltablevalue[i].TestStore,
                            "Controlstore": this.Fulltablevalue[i].Controlstore,
                            "Similarval": this.Fulltablevalue[i].Similarval,
                            "Salescorrelation": this.Fulltablevalue[i].Salescorrelation                      
                        })
                }
            }
            this.MatchValues_DATA = temp_lift;
            this.MatchResultsdata = temp_lift;
    }

    ontestDeSelectAll(event:any)
    {
        let temp_lift:any = []; 
         this.MatchValues_DATA = temp_lift;
         this.MatchResultsdata = temp_lift;
    }

    ontestSelectAll(event:any)
    {
         let temp_lift:any = []; 
         for (var i = 0; i <= this.Fulltablevalue.length - 1; i++) {                
            temp_lift.push({
                "TestStore": this.Fulltablevalue[i].TestStore,
                    "Controlstore": this.Fulltablevalue[i].Controlstore,
                    "Similarval": this.Fulltablevalue[i].Similarval,
                    "Salescorrelation": this.Fulltablevalue[i].Salescorrelation                      
                })               
            }

         this.MatchValues_DATA = temp_lift;
         this.MatchResultsdata = temp_lift;
    }
    movetostp5_saved()
    {
        this.n_control_required = false;
        this.showcnt1 = false;
        this.showcnt2 = false;
        this.showcnt3 = true;
        this.CompletedStep4 = true;
        this.wizard.goToNextStep();
        
        this.reportdata = JSON.parse(this.temp_Datas.controlstring.data.matches)
        this.MatchValues_DATA = this.temp_Datas.match_results;
        this.MatchResultsdata = this.temp_Datas.match_results;

        this.parse_sales_data = JSON.parse(this.temp_Datas.controlstring.data.sales);

        var resArr: any = [];
        this.Filterdatafor_Testore(this.parse_sales_data);
        this.vistest_modelid = this.VisResTeststr[0].id;
        this.arr2 = [];
        this.GetChartdata(this.vistest_modelid, this.parse_sales_data)


        if (this.no_of_cntrl == 1) {
            this.displayedColsStatrslts = ['VariableName', 'PValue'];
        }
        if (this.no_of_cntrl == 2) {
            this.displayedColsStatrslts = ['VariableName', 'PValue', 'PValue1'];
        }
        if (this.no_of_cntrl == 3) {
            this.displayedColsStatrslts = ['VariableName', 'PValue', 'PValue1', 'PValue2'];
        }
        if (this.no_of_cntrl == 4) {
            this.displayedColsStatrslts = ['VariableName', 'PValue', 'PValue1', 'PValue2', 'PValue3'];
        }
        if (this.no_of_cntrl == 5) {
            this.displayedColsStatrslts = ['VariableName', 'PValue', 'PValue1', 'PValue2', 'PValue3', 'PValue4'];
        }

        let temp_statusss = this.temp_Datas.stat_results;
        this.StatResultsdata =  temp_statusss;
        this.Stat_Result_Data = temp_statusss;
    }

    restrictNumeric(event: any, value: any, min: any, max: any) {
        if (parseInt(value) < min || isNaN(parseInt(value))) {
            this.no_of_cntrl = '';
        } else if (parseInt(value) > max || isNaN(parseInt(value))) {
            this.no_of_cntrl = 5;
        }
    }

    enterStep($event: any) {}
    /*Wizard Navigations*/
    /*DatePicker functions*/
    StartDate(date: NgbDate) {
        if (this.model1 && this.model2) {
            // this.days =
            //     (new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime() -
            //         new Date(this.model1.year + '-' + this.model1.month + '-' + this.model1.day).getTime()) /
            //     (24 * 60 * 60 * 1000);


            // this.days = Math.round((this.days + 1) / 7);

            // if (this.days > 0) {
            //     this.date_valid = true;
            // } else {
            //     this.date_valid = false;
            //     this.days = 0;
            // }

            let datas = {
                "start" : this.model1,
                "end"   : this.model2
            }
            this.wizard2service.GetWeeks(datas).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {                    
                    this.days = parseInt(apiresponse.data.interval);
                    let tempstrt = apiresponse.data.startdate.split(" ")
                    let tempend = apiresponse.data.enddate.split(" ")
                    this.analystartdate = tempstrt[0]
                    this.analyenddate = tempend[0]
                    if (this.days > 0) {
                        this.date_valid = true;
                    } else {
                        this.date_valid = false;   
                        this.days =0                     
                    }

                }   
            }
        );


        }

        if (this.model1) {
            this.startdt_req = true;
        } else {
            this.startdt_req = false;
        }
    }

    EndDate(date: NgbDate) {
        if (this.model1 && this.model2) {
            // this.days =
            //     (new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime() -
            //         new Date(this.model1.year + '-' + this.model1.month + '-' + this.model1.day).getTime()) /
            //     (24 * 60 * 60 * 1000);
            // this.days = Math.round(this.days / 7);
            // if (this.days > 0) {
            //     this.date_valid = true;
            // } else {
            //     this.date_valid = false;
            //     this.days = 0;
            // }

            let datas = {
                "start" : this.model1,
                "end"   : this.model2
            }
            this.wizard2service.GetWeeks(datas).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {                    
                    this.days = parseInt(apiresponse.data.interval);
                    let tempstrt = apiresponse.data.startdate.split(" ")
                    let tempend = apiresponse.data.enddate.split(" ")
                    this.analystartdate = tempstrt[0]
                    this.analyenddate = tempend[0]
                    
                    if (this.days > 0) {
                        this.date_valid = true;
                    } else {
                        this.date_valid = false;  
                        this.days =0                      
                    }

                }   
            }
        );


        }
        if (this.model2) {
            this.enddt_req = true;
        } else {
            this.enddt_req = false;
        }

        

    }

    /*DatePicker functions*/
    /*File Upload*/
    getFileData_features(event: any) {
        this.featurevalue = event.target.files[0].name;
        if (this.featurevalue != '') {
            var excel = event.target.files.length;
            for (let i = 0; i < excel; i++) {
                var reader = new FileReader();
                //console.log(event.target.files[i]);
                this.myFiles1.push(event.target.files[i]);
            }
            this.submit_visible = false;
        }
    }

    SubmitFile(event: any) {
        const frmData1 = new FormData();
        for (var i = 0; i < this.myFiles1.length; i++) {
            frmData1.append('check_feature', this.myFiles1[i]);
        }
        //this.ValidateMatchstore();
        this.wizard2service.CheckaddiFeature(frmData1).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {
                    
                    for(let i =0; i<=apiresponse.data.Additional_Features.length -1 ; i++)
                    {
                        this.highlight_additionlfeat.push(apiresponse.data.Additional_Features[i]);
                    }
                    this.Additional_Features_data = apiresponse.data.Additional_Feature_data;
                    if(apiresponse.data.Match_features.length>0)
                    {   
                        let temp_meas:any;
                            for (var i = 0; i <= apiresponse.data.Match_features.length -1; i++) {
                                temp_meas  = apiresponse.data.Match_features[i] + ","
                            };
                            
                            var message = temp_meas +' exists in the current list of considered features , please replace or continue.';
                            var action = 'close';
                        this._snackBar.open(message, action, {
                            duration: 10000,
                            verticalPosition: 'bottom'
                        });
                        return;

                    }
                    if (apiresponse.data.AllTest_store == apiresponse.data.Match_store) {
                        this.ValidateMatchsuccessstore(apiresponse.data.Additional_Features.length, apiresponse.data.Match_store);    

                    } else {
                       
                        if(apiresponse.data.UnMatch_id==0)
                        {
                            this.ValidateMatchstore(apiresponse.data.AllTest_store, apiresponse.data.Match_store);    
                        }
                        
                        else
                        {
                            this.ValidateMatchstore1(apiresponse.data.AllTest_store, apiresponse.data.UnMatch_id);
                        }
                    }
                } else {
                    var action = 'close';
                        this._snackBar.open(apiresponse.data, action, {
                            duration: 10000,
                            verticalPosition: 'bottom'
                        });
                    
                }
            },
            error => {}
        );
    }

    ValidateMatchsuccessstore(Allstores: any, Matchstores: any) {
        
         var message =
          Allstores  + ' additional feature(s) uploaded successfully ';
        var action = 'close';
        this._snackBar.open(message, action, {
            duration: 10000,
            verticalPosition: 'bottom'
        });
        }

    ValidateMatchstore(Allstores: any, Matchstores: any) {
        // var message =
        //     'Features are expected for ' + Allstores + ' store(s), but are available only for ' + Matchstores + ' stores.';
        // var action = 'close';
        // this._snackBar.open(message, action, {
        //     duration: 10000,
        //     verticalPosition: 'bottom'
        // });

        this._snackBar.openFromComponent(SnackbarControlComponent, {
    duration: 10000,
    data: {
      verticalPosition: 'bottom',
      expected_for: Allstores,
      uploaded_for: Matchstores,
      format:1,
      message_type:'warning',
    }
  });

    }
    ValidateMatchstore1(Allstores: any, UnMatch_id: any) {
        var message =
            'Features uploaded have invalid store ID for ' + UnMatch_id + ' store(s), upload again or continue';
        var action = 'close';
        this._snackBar.open(message, action, {
            duration: 10000,
            verticalPosition: 'bottom'
        });
    }
    getFileData_excludematching(event: any) {
        this.file_exclude = event.target.files[0].name;
        if (this.file_exclude != '') {
            var excel = event.target.files.length;
            for (let i = 0; i < excel; i++) {
                var reader = new FileReader();
                //console.log(event.target.files[i]);
                this.myFiles2.push(event.target.files[i]);
            }
            this.submitcntrl_visible = false;
        }
    }

    SubmitControlStrFile(event: any) {
        var teststoreids = localStorage.getItem('teststoreids');
        var storeidarray = JSON.parse(teststoreids);
        var strArr: any = [];
        for (var itr = 0; itr < storeidarray.length; itr++) {
            strArr[itr] = '' + storeidarray[itr];
        }

        const frmData2 = new FormData();
        for (var i = 0; i < this.myFiles2.length; i++) {
            frmData2.append('exclude_store', this.myFiles2[i]);
            frmData2.append('teststore', strArr);

        }
        //this.ValidateMatchstore();
        this.wizard2service.Excludecontrolstore(frmData2).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {
                    if (apiresponse.data.match_data != '[]') {
                        let temp_val: any = apiresponse.data.match_data;
                        this.Excluecontrolstore = apiresponse.data.match_data;

                        this.ValidateControlstore(this.Excluecontrolstore.length);
                        // --modaol call---
                    }
                } else {
                    var action = 'close';
                        this._snackBar.open(apiresponse.data, action, {
                            duration: 10000,
                            verticalPosition: 'bottom'
                        });                    
                }
            },
            error => {}
        );
    }

    ValidateControlstore(UnmatchCntrlstore: any) {
        if (UnmatchCntrlstore == 1) {
            var message = UnmatchCntrlstore + ' store-id excluded from this test.';
        } else {
            var message = UnmatchCntrlstore + ' store-id(s) are excluded from this test.';
        }


        var action = 'close';
        this._snackBar.open(message, action, {
            duration: 10000,
            verticalPosition: 'bottom'
        });
    }

    /*File Upload*/
    /*Considered features Dialog*/
    ViewConsideredFeature(content: any) {
        this.modalService
            .open(content, {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'ViewconsiderFeat'
            })
            .result.then(
                result => {
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                    this.TREE_DATA = [];
                }
            );
        this.GetConsideredFeatures();
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
            this.TREE_DATA = [];
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
            this.TREE_DATA = [];
        } else {
            return `with: ${reason}`;
            this.TREE_DATA = [];
        }
    }
    /*Considered features Dialog*/
    /*Advance setting Dialog*/
    AdvanceSettings(advnc_setting_content: any) {
        this.modalService
            .open(advnc_setting_content, {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'Advncesetting'
            })
            .result.then(
                result => {
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                    this.closeResult = `Dismissed ${this.CloseAdvanceSetting(reason)}`;
                }
            );
        setTimeout(() => {
            this.AdvSettingDatasrc.sort = this.sort;
            this.Advancedsettingdata = this.AdvanceData;
        });
    }

    SaveAdvSetting() {
        this.modalService.dismissAll();

    }

    private CloseAdvanceSetting(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    /*Advance setting Dialog*/
    match_results() {
        this.show_match_results = true;
        this.show_visualize_results = true;
        this.show_statistical_results = false;
    }

    visulaize_results() {
        this.show_match_results = false;
        this.show_visualize_results = false;
        this.show_statistical_results = false;

        Highcharts.chart('container', {
            chart: {
                type: 'spline',
                scrollablePlotArea: {
                    minWidth: 1200
                },
                backgroundColor: '#FFFFFF'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            /*subtitle: {
                            text: 'Source: thesolarfoundation.com'
                        },*/
            xAxis: {
                type: 'category',
                categories: this.weekendDate,
                gridLineDashStyle: 'LongDash',
                gridLineColor: '#FAFAFA',
                gridLineWidth: 2,
                labels: {
                    rotation: -90,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Arial'

                    }
                },
                title: {
                    text: 'Week End Date',
                    style: {
                        top: '20px',
                        color: '#778899',
                        fontSize: '14px',
                        fill: '#778899',
                        fontFamily: 'Arial'

                    }
                }
            },
            yAxis: {
                gridLineWidth: 2,
                gridLineDashStyle: 'LongDash',
                gridLineColor: '#FAFAFA',
                title: {
                    text: 'Standardised Sales',
                    style: {
                        color: '#778899',
                        fontSize: '14px',
                        fill: '#778899',
                        fontFamily: 'Arial',
                    }
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                margin:20,
                itemStyle: {
                    color: '#778899',
                    fontFamily: 'Arial',
                }
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    marker: {
                        enabled: false
                    }
                    // pointStart: 2010
                }
            },

            series: this.arr2,
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 1200
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    }

    downloadCSV() {
		
		let trai_name = localStorage.getItem('trial_name'); 
        var options = {
            title: '',
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            useBom: true,
            headers: this.reportcolumns
        };
        new Angular5Csv(this.reportdata, trai_name+'_control store matching report', options);
	
	}

    stat_results() {
        this.show_match_results = false;
        this.show_visualize_results = true;
        this.show_statistical_results = true;
    }


    VisTestSelect($event: any) {

        this.arr2 = []
        this.GetChartdata(this.vistest_modelid, this.parse_sales_data)
        let inputElement: HTMLElement = this.chartclick.nativeElement as HTMLElement;
        inputElement.click();
    }

    log(event: any) {}

    sortDataMatchvals(sort: Sort) {
        const data = this.MatchResultsdata.slice();
        if (!sort.active || sort.direction === '') {
            this.MatchResultsdata = data;
            return;
        }
        this.MatchResultsdata = data.sort((a: any, b: any) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'Test Store':
                    return compare_store(a.TestStore, b.TestStore, isAsc);
                case 'Control Store':
                    return compare_store(a.Controlstore, b.Controlstore, isAsc);
                case 'Similarity Value':
                    return compare_store(a.Similarval, b.Similarval, isAsc);
                case 'Sales Correlation':
                    return compare_store(a.Salescorrelation, b.Salescorrelation, isAsc);
                default:
                    return 0;
            }
        });
    }

    sortDataStatvals(sort: Sort) {
        const data = this.StatResultsdata.slice();
        if (!sort.active || sort.direction === '') {
            this.StatResultsdata = data;
            return;
        }
        this.StatResultsdata = data.sort((a: any, b: any) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'VariableName':
                    return compare_statrslt(a.VariableName, b.VariableName, isAsc);
                case 'PValue':
                    return compare_statrslt(a.PValue, b.PValue, isAsc);
                default:
                    return 0;
            }
        });
    }

    toYMD(date :Date)
    {
        return moment(date).format("MMM d, YYYY")
    }

    Movetowizard3() {
        var market_id = localStorage.getItem('market_id');
        var trial = localStorage.getItem('trial');
        let stgandtrial: any = {
            stage_id: 2,
            trial: trial.toString(),
        }
        let data: any = {
            market_id: market_id,
            stage_id: 2,
            trial: trial,
            /*step 3*/
            target_metric: this.testmetricmodelid,
            Hierarchy: this.hiermodelid.toString(),
            prd_cat: this.category_array,
            prd: this.product_array,
            Startdt: this.stdate,
            Enddt: this.enddate,
            fe_Startdt: this.toYMD(this.analystartdate),
            fe_Enddt: this.toYMD(this.analyenddate),
            Analystartdate :  this.analystartdate,
            Analyenddate :  this.analyenddate,
            duration_window: this.days,
            additional_feat_filename: this.featurevalue,
            /*step 3*/
            /*step 4*/
            adjusted_r_squared: this.adjustedval,
            selected_feat: this.seleceted,
            unselected_feat: this.unselected,
            exclude_cntrl_filename: this.file_exclude,
            no_of_cntrl: this.no_of_cntrl,
            advncsetting: this.adv_teststoreobj,
            /*step 4*/
            /*step5*/
            match_results: this.MatchValues_DATA,
            vis_results: this.arr2,
            stat_results: this.StatResultsdata,
            analystring :this.analystringify,
            controlstring: this.controlstringify
            /*step 5*/
        };
        var stringified_data = JSON.stringify(data);
        

        this.wizard2service.SaveStageTwo(stgandtrial, stringified_data).subscribe((apiresponse: any) => {
            if (apiresponse.status == 'ok') {
                this.toastr.success('Stage saved successfully!', 'Stage 2');
                this.router.navigate(['./testmeasure']);
            } else {}
        });
    }

    Movetowizard3_Save()
    {
       combineLatest(this.route.params, this.route.queryParams).pipe(map(results => ({
            params: results[0],
            query: results[1]
        }))).subscribe(results => {

            if(results)
               {
                   if(results.query)
                   {
                       if(results.query.trial)
                       {

                       let navigationExtras = {
                            queryParams: {
                                "trial": results.query.trial,                           
                            }
                        };
                        this.router.navigate(['./testmeasure'],navigationExtras); 

                    }
                }
            }
        })     
    }


    drop(event: CdkDragDrop < string[] > ) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    }

    // move() {
    //   this.ngzone.run(() => {
    //     for (var i = 0; i < this.checked.length; i++) {
    //       if (this.done.find((x: any) => x.ep_id == this.checked[i]['ep_id'])) {
    //         this.toastr.warning('', 'This Computers already added');
    //         return;
    //       }
    //       var index = this.seleceted.indexOf(this.checked[i]);
    //       if (index !== -1) {
    //         this.seleceted.splice(index, 1);
    //         this.checked[i].selected = false;
    //         this.unselected.push(this.checked[i]);
    //         this.unselected[i].selected = false;
    //       }
    //     }
    //     this.checked = [];
    //   });
    // }
    //   arr()
    // {
    //     for(var i=0;i<this.unselected.length;i++)
    //      {
    //         if($.inArray(this.unselected[i],this.highlighttext[i]) ==-1){
    //                   return "highlight";

    //         }
    //                //here it returns that arr1 value does not contain the arr2
    //         else{
    //           // return "highlight";
    //         }
    //              // here it returns that arr1 value contains in arr2

    //      }

    // }

    arr(i: any) {
        if (this.highlight_additionlfeat.indexOf(this.unselected[i]) > -1) {
            // console.log(this.highlighttext.length);
            return 'highlight';
        } else {}
    }
    selarr(i: any) {
        if (this.highlight_additionlfeat.indexOf(this.seleceted[i]) > -1) {
            // console.log(this.highlighttext.length);
            return 'highlight_selected';
        } else {}
    }
}

function compare_store(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compare_statrslt(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}