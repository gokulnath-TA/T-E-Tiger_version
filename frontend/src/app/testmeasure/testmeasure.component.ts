import {
    Component,
    OnInit,
    ViewChild,
    NgZone
} from '@angular/core';
import {
    finalize
} from 'rxjs/operators';
import {
    WizardComponent
} from 'angular-archwizard';
import {
    TestMeasureService
} from './testmeasure.service';
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
import {
    combineLatest,
    of
} from 'rxjs';
import {
    MatSnackBar
} from '@angular/material/snack-bar';
import {
    Angular5Csv
} from 'angular5-csv/dist/Angular5-csv';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import {
    MatRadioModule
} from '@angular/material/radio';
import {
    MatRadioChange
} from '@angular/material';
HC_exporting(Highcharts);

import * as moment from 'moment';
import { environment} from '../../environments/environment'

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

declare var $: any;

export interface Liftanalysisvalues {
    StoreGroup: any;
    ControlstoreNum: any;
    Rank_No: any;
    StoreName: any;
    Variables: any;
    Post_Period: any;
    Pre_Period: any;
    Lift: any;
}

export interface Stat_Result_Data {
    VariableName: any;
    PValue: any;
}

@Component({
    selector: 'app-wizard3',
    templateUrl: './testmeasure.component.html',
    styleUrls: ['./testmeasure.component.scss']
})
export class TestMeasureComponent implements OnInit {
    quote: string;
    isLoading: boolean;
    isShow: boolean = false;
    lift_vals_size = 10;
    stat_vals_size = 5;
    showcnt1: boolean = true;
    showcnt2: boolean = false;
    showcnt3: boolean = false;
    key: any;
    numberval: any = 1;
    featurevalue: any = '';
    show_fileextnerror_feature: boolean = false;
    show_fileextnerror_excludematching: boolean = false;
    model1: NgbDateStruct;
    model2: NgbDateStruct;
    model3: NgbDateStruct;
    model4: NgbDateStruct;

    public Variabletoanlyze: any[] = [];
    public Variabletoanlyze_lift: any[] = [];
    public Testtoanlyze: any[] = ['Test Store 1', 'Test Store 2', 'Test Store 3'];

    MeaurementMetricSet: any = {};
    testvscntrl_testr: any = []
    testvscntrl_testr1:any =[]
    parse_postmetrics:any = []
    TestVscntrlSet: any = {};
    TimeSeriesSet:any = {};
    Timeseri_metix:any;
    Timeseries_stores:any;
    TestcntrlLiftSet: any = {};
    MeaurementMetricval: any = [];
    predays: number = 0;
    postdays: number = 0;
    postdays1: number = 0;
	liftcomparison:any =[]
    date: NgbDateStruct;
    items: any = [];
    tempFilter: any;
    pageIndex: any;
    selected: any = [];
    metirc_array: any = [];
    Metricmodelid: any = [];
    testvscntrl_teststore: any = [];
    reportlist:any = []
    testcntrllift_teststore: any = [];
    LiftAnalysisdata: any;
    StatResultsdata: any;
    CompletedStep6: any = false;
    currentres: boolean = true;
    currentvr: boolean = false;
    currentssr: boolean = false;
    variable_name: any = []
    show_match_results: boolean = true;
    TimeSeries:boolean = false
    show_visualize_results: boolean = true;
    show_statistical_results: boolean = false;
    Testvscontrol = false; //chart
    Teststorelift = true;
    Time_series = true;
    Teststorecomp = true; //chart
    parse_measureTest_data: any = []
    stdate: any;
    stdate1: any;
    enddate: any;
    enddate1: any;
    metrix: any = []
    target_metric_req: boolean = true;
    startdt_req: boolean = true;
    startdt1_req: boolean = true;
    enddt_req: boolean = true;
    enddt1_req: boolean = true;
    date_valid: boolean = true;
    date_valid0: boolean = true;
    date_valid1: boolean = true;
    graphtemp_store: any = []
    graphtemp_control: any = []
    teststrlift_var: any;
    testvscntrl_var:any;
    graphtemp1_store: any = []
    graphtemp12_store:any = []
    disablestore: boolean = true;
    disablestore_time :boolean = true;
	storeMap:any
    vistest_modelid: any = [];
    grapshow:boolean =false;
    grapshow1:boolean =false;
    premindate:any
    premaxdate:any
    no_of_cntrl: any ;
    weekendDate: any = []
    TimeSeries_metic:any;
    loaddatas:boolean = false;
    Timeseri_teststore:any;
    postmindate:any
    postmaxdate:any
    metrix1:any;
    delta1:any;
    Stat_Result_Data: Stat_Result_Data[] = [];
    temp_measuredata:any =[]
    arr2: any = [];

    LiftAnalysis_DATA: Liftanalysisvalues[] = [];
    overall_graph:boolean=true;

    @ViewChild(MatSort) sort: MatSort;
    LiftAnalysisDatasrc = new MatTableDataSource < any > (this.LiftAnalysis_DATA);
    StatValuesDatasrc = new MatTableDataSource < any > (this.Stat_Result_Data);


    /*------------------SELECT Locality------SELECT ALL---------*/

    @ViewChild(WizardComponent)
    public wizard: WizardComponent;
    public VisResTeststr: any[] = [{
            vistest_id: 1,
            vistest_name: 'Test Store 1'
        },
        {
            vistest_id: 2,
            vistest_name: 'Test Store 2'
        }
    ];


    displayedColumns: string[] = ['TestStore', 'State', 'StoreType', 'Locality'];
    displayedLiftCols: string[] = [
        'StoreGroup',
		'teststoreNum',
        'ControlstoreNum',
        'Rank_No',
        'Variables',
        'Pre_Period',
        'Post_Period',
        'Lift'
    ];
    displayedColsStatrslts: string[] = ['VariableName', 'PValue','Lift'];


    /*------------Filter Tables---------------*/

    FilterLiftanalysis(event: string) {
        const val = event.toLowerCase();
        this.tempFilter = this.LiftAnalysis_DATA;
        const temp = this.tempFilter.filter(function(d: any) {
            return (
                d.ControlstoreNum.toLowerCase().indexOf(val) !== -1 ||
                // d.Variables.toLowerCase().indexOf(val) !== -1 ||
                // d.ControlstoreNum.toLowerCase().indexOf(val) !== -1 ||
                // d.StoreName.toLowerCase().indexOf(val) !== -1 ||
                // d.Post_Period.toLowerCase().indexOf(val) !== -1 ||
                // d.Pre_Period.toLowerCase().indexOf(val) !== -1 ||
                // d.Rank_No.toString()
                //   .toLowerCase()
                //   .indexOf(val) !== -1 ||
                !val
            );
        });
        this.LiftAnalysisdata = temp;
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
        private wizard3service: TestMeasureService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private _snackBar: MatSnackBar,
        private router: Router) {}

    ngOnInit() {
        setTimeout(() => {
            this.LiftAnalysisdata = this.LiftAnalysis_DATA;
            this.LiftAnalysisDatasrc.sort = this.sort;
            this.StatResultsdata = this.Stat_Result_Data;
            this.StatValuesDatasrc.sort = this.sort;
        });



        this.MeaurementMetricval = [{
                mmid: 3,
                mmtext: 'Transaction Count'
            },
            {
                mmid: 2,
                mmtext: 'Gross Sales'
            },
            {
                mmid: 1,
                mmtext: 'Net Sales'
            }
        ];


        this.MeaurementMetricSet = {
            singleSelection: false,
            idField: 'mmid',
            textField: 'mmtext',
            selectAllText: 'Select All',
            unSelectAllText: 'Unselect All',
            itemsShowLimit: 1,
            enableCheckAll: true,
            allowSearchFilter: false
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

         this.TimeSeriesSet = {
            singleSelection: true,
            idField: 'id',
            textField: 'text',
            selectAllText: 'Select All',
            unSelectAllText: 'Unselect All',
            itemsShowLimit: 1,
            enableCheckAll: false,
            allowSearchFilter: true
        };



        this.TestcntrlLiftSet = {
            singleSelection: false,
            idField: 'id',
            textField: 'text',
            selectAllText: 'Select All',
            unSelectAllText: 'Unselect All',
            itemsShowLimit: 1,
            enableCheckAll: false,
            allowSearchFilter: false
        };
       

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
                           this.wizard3service.LoadSavedTest(results.query.trial).subscribe((apiresponse: any) => {
                            if (apiresponse.status == 'ok') {
                            let parseData = JSON.parse(apiresponse.data.records[0].record_value)
                            let parseData1 = JSON.parse(apiresponse.data.records[1].record_value)

                            if(apiresponse.data.records.length==3)
                            {
                                this.loaddatas = true;
                                this.disablestore =true
                                let parseData2 = JSON.parse(apiresponse.data.records[2].record_value)
                                
                                let tempstart_Date:any = parseData2.pre_start.split("-")
                                this.model1 = {"year":parseInt(tempstart_Date[0]),"month":parseInt(tempstart_Date[1]),"day":parseInt(tempstart_Date[2])}
                                let tempend_Date:any = parseData2.pre_end.split("-")
                                this.model2 = {"year":parseInt(tempend_Date[0]),"month":parseInt(tempend_Date[1]),"day":parseInt(tempend_Date[2])}

                                let tempstart_Date1:any = parseData2.post_start.split("-")
                                this.model3 = {"year":parseInt(tempstart_Date1[0]),"month":parseInt(tempstart_Date1[1]),"day":parseInt(tempstart_Date1[2])}
                                let tempend_Date1:any = parseData2.post_end.split("-")
                                this.model4 = {"year":parseInt(tempend_Date1[0]),"month":parseInt(tempend_Date1[1]),"day":parseInt(tempend_Date1[2])}
                                
                                this.Metricmodelid = parseData2.measurement_metrix                                
                                this.temp_measuredata = parseData2.measureTest      
                                this.postdays = parseData2.postdays
                                this.predays = parseData2.predays
                                this.variable_name = parseData2.variable
                                let metric = parseData2.metric
                                this.metrix1 = parseData2.metric
                                this.delta1 = parseData2.delta
                                this.parse_measureTest_data = parseData2.measureTest
                                let lift = parseData2.delta
                               
                                var stat_arr: any = []

                                for (var i = 0; i <= metric.length - 1; i++) {

                                    if(metric[i]=='-0')
                                    {
                                        stat_arr.push({
                                        'VariableName': this.variable_name[i],
                                        'PValue': null,
                                        'Lift' : lift[i]
                                    });
                                    }
                                    else
                                    {
                                    stat_arr.push({
                                        'VariableName': this.variable_name[i],
                                        'PValue': metric[i],
                                        'Lift' : lift[i]
                                    });
                                }

                                };

                                let temp_teststore: any = []
                                this.testvscntrl_testr = []
                                this.testvscntrl_testr1 =[]
                                for (var i = 0; i <= this.temp_measuredata.length - 1; i++) {
                                    if (this.temp_measuredata[i].storeGroup == "TEST") {
                                        if (temp_teststore.find((x: any) => x.id == this.temp_measuredata[i].storeID)) {} else {
                                            temp_teststore.push({
                                                "id": this.temp_measuredata[i].testStores,
                                                "text": this.temp_measuredata[i].testStores 
                                            });
                                        }
                                    }
                                }
                                this.testvscntrl_teststore = temp_teststore                                
                                this.testvscntrl_testr1 = temp_teststore
                                this.liftcomparison = parseData2.deltagraph
                                this.Variabletoanlyze = this.variable_name
                                this.Variabletoanlyze_lift = this.variable_name
                                this.Stat_Result_Data = stat_arr
                                this.StatResultsdata = this.Stat_Result_Data

                                this.parse_postmetrics = parseData2.postmetrics;
                                this.no_of_cntrl = parseData2.no_of_cntrl;
                                console.log(parseData2)
                            }
                            else if(apiresponse.data.records.length==2)
                            {
                                this.loaddatas = true;
                                this.disablestore =true
                                let parseData2 = JSON.parse(apiresponse.data.records[1].record_value)
                                if(parseData2.stage_id==3)
                                {
                                    let tempstart_Date:any = parseData2.pre_start.split("-")
                                    this.model1 = {"year":parseInt(tempstart_Date[0]),"month":parseInt(tempstart_Date[1]),"day":parseInt(tempstart_Date[2])}
                                    let tempend_Date:any = parseData2.pre_end.split("-")
                                    this.model2 = {"year":parseInt(tempend_Date[0]),"month":parseInt(tempend_Date[1]),"day":parseInt(tempend_Date[2])}

                                    let tempstart_Date1:any = parseData2.post_start.split("-")
                                    this.model3 = {"year":parseInt(tempstart_Date1[0]),"month":parseInt(tempstart_Date1[1]),"day":parseInt(tempstart_Date1[2])}
                                    let tempend_Date1:any = parseData2.post_end.split("-")
                                    this.model4 = {"year":parseInt(tempend_Date1[0]),"month":parseInt(tempend_Date1[1]),"day":parseInt(tempend_Date1[2])}
                                    
                                    this.Metricmodelid = parseData2.measurement_metrix                                
                                    this.temp_measuredata = parseData2.measureTest      
                                    this.postdays = parseData2.postdays
                                    this.predays = parseData2.predays
                                    this.variable_name = parseData2.variable
                                    let metric = parseData2.metric
                                    this.metrix1 = parseData2.metric
                                    this.delta1 = parseData2.delta
                                    this.parse_measureTest_data = parseData2.measureTest
                                    let lift = parseData2.delta
                                   
                                    var stat_arr: any = []

                                    for (var i = 0; i <= metric.length - 1; i++) {

                                        if(metric[i]=='-0')
                                        {
                                            stat_arr.push({
                                            'VariableName': this.variable_name[i],
                                            'PValue': null,
                                            'Lift' : lift[i]
                                        });
                                        }
                                        else
                                        {
                                        stat_arr.push({
                                            'VariableName': this.variable_name[i],
                                            'PValue': metric[i],
                                            'Lift' : lift[i]
                                        });
                                    }

                                    };

                                    let temp_teststore: any = []
                                    this.testvscntrl_testr = []
                                    this.testvscntrl_testr1 =[]
                                    for (var i = 0; i <= this.temp_measuredata.length - 1; i++) {
                                        if (this.temp_measuredata[i].storeGroup == "TEST") {
                                            if (temp_teststore.find((x: any) => x.id == this.temp_measuredata[i].storeID)) {} else {
                                                temp_teststore.push({
                                                    "id": this.temp_measuredata[i].testStores,
                                                    "text": this.temp_measuredata[i].testStores 
                                                });
                                            }
                                        }
                                    }
                                    this.testvscntrl_teststore = temp_teststore                                
                                    this.testvscntrl_testr1 = temp_teststore
                                    this.liftcomparison = parseData2.deltagraph
                                    this.Variabletoanlyze = this.variable_name
                                    this.Variabletoanlyze_lift = this.variable_name
                                    this.Stat_Result_Data = stat_arr
                                    this.StatResultsdata = this.Stat_Result_Data

                                    this.parse_postmetrics = parseData2.postmetrics;
                                    this.no_of_cntrl = parseData2.no_of_cntrl;
                                }
                            }
                            
                            let temp_id:any =[];
                            temp_id = "[" + parseData.select_store + "]"; 
                            localStorage.setItem('trial_name',parseData.test_name)
                            localStorage.setItem('teststoreids',temp_id)
                            localStorage.setItem('trial',apiresponse.data.test_id)
                            localStorage.setItem('market_id',apiresponse.data.market.market_id)

                            // var date = new Date(parseData1.Startdt);
                            // var date1 = new Date(parseData1.Enddt);
                            

                            // localStorage.setItem('Startdate',moment(date).format("YYYY-MM-DD"))
                            // localStorage.setItem('Enddate',moment(date1).format("YYYY-MM-DD"))



                        }
                    });
                }
            }
        }
    });
    // let check_from:any = localStorage.getItem('FromMeasurement')
    // if( check_from == '1')
    // {
        this.wizard3service.GetDateRange().subscribe((apiresponse: any) => {
        if (apiresponse.status == 'ok') {

            localStorage.setItem('Startdate',moment(apiresponse.data.startdate).format("YYYY-MM-DD"))
            localStorage.setItem('Enddate',moment(apiresponse.data.enddate).format("YYYY-MM-DD"))            
        }    
        });
    // }

    setTimeout(() => {
        let temp_startdate:any  = localStorage.getItem('Startdate')
        temp_startdate = temp_startdate.split('-') 
        this.premindate =  {"year":parseInt(temp_startdate[0]),"month":parseInt(temp_startdate[1]),"day":parseInt(temp_startdate[2])}

        let temp_enddate:any = localStorage.getItem('Enddate')
        temp_enddate = temp_enddate.split('-') 
        this.premaxdate =  {"year":parseInt(temp_enddate[0]),"month":parseInt(temp_enddate[1]),"day":parseInt(temp_enddate[2])}
        
        let temp_startdate1:any = localStorage.getItem('Startdate')
        temp_startdate1 = temp_startdate1.split('-') 
        this.postmindate =  {"year":parseInt(temp_startdate1[0]),"month":parseInt(temp_startdate1[1]),"day":parseInt(temp_startdate1[2])}

        let temp_enddate1:any = localStorage.getItem('Enddate')
        temp_enddate1 = temp_enddate1.split('-') 
        this.postmaxdate =  {"year":parseInt(temp_enddate1[0]),"month":parseInt(temp_enddate1[1]),"day":parseInt(temp_enddate1[2])}

        },1000);

    }


    onMetricSelectAll(metricval:any)
    {
        this.metirc_array =[];

        for (var i = 0 ; i <=metricval.length -1 ; i++) {                    
         this.metirc_array.push({"mmid":metricval[i].mmid ,"mmtext":metricval[i].mmtext});          
        }
          if (this.target_metric_req == false) {
                this.target_metric_req = true;
        }

    }
    /*Metric select*/
    onMetricSelect(metricval: any) {
        let el = this.metirc_array.find((itm: any) => itm.mmid != metricval.mmid);
        this.metirc_array.push({"mmid":metricval.mmid ,"mmtext":metricval.mmtext});
           if (this.target_metric_req == false) {
                this.target_metric_req = true;
        }        
        
    }

    onMetricDeSelect(metricval: any) {

        let el = this.metirc_array.find((itm: any) => itm.mmid === metricval.mmid);
        if (el) {
            this.metirc_array.splice(this.metirc_array.indexOf(el), 1);
        }
    }

    onMetricDeSelectAll(metricval:any)
    {
        this.metirc_array = []
    }
    /*Metric select*/
    /*-------------------Pagination------------------------*/
    paginateLiftvals(event: any) {
        this.pageIndex = event;
        this.LiftAnalysisdata = this.LiftAnalysis_DATA.slice(
            event * this.lift_vals_size - this.lift_vals_size,
            event * this.lift_vals_size
        );
    }


    paginatestatvals(event: any) {
        this.pageIndex = event;
        this.StatResultsdata = this.Stat_Result_Data.slice(
            event * this.stat_vals_size - this.stat_vals_size,
            event * this.stat_vals_size
        );
    }

    Perpagerefresh() {
        setTimeout(() => {
            this.LiftAnalysisdata = this.LiftAnalysis_DATA;
            this.LiftAnalysisDatasrc.sort = this.sort;
            this.StatResultsdata = this.Stat_Result_Data;
            this.StatValuesDatasrc.sort = this.sort;
        });
    }
    /*-------------------Pagination------------------------*/

    perpageLiftVals(event: any) {
        this.lift_vals_size = event.target.value;
        this.Perpagerefresh();
    }

    perpageStatVals(event: any) {
        this.stat_vals_size = event.target.value;
        this.Perpagerefresh();
    }

    /*Wizard Navigations*/
    MoveToWizard1() {
        this.router.navigate(['./testconfig']);
    }

    MoveToWizard2() {
         var myObject = {
            w2stepval: 2
        };
        var myObjectJson = JSON.stringify(myObject);
        sessionStorage.setItem('w2index', myObjectJson);


        localStorage.setItem('backto','5')
        let trial_name =  localStorage.getItem('trial_name')
           let navigationExtras = {
                queryParams: {
                    "trial": trial_name,                           
                }
            };
            this.router.navigate(['./controlstore'],navigationExtras);
        
    }

    movebcktostp6() {
        this.wizard.goToPreviousStep();
        this.showcnt1 = true;
        this.showcnt2 = false;
        this.TimeSeries = false;
        this.CompletedStep6 = false;
    }

    Filterdatafor_Testore(salesdata: any) {
        this.parse_postmetrics = salesdata;
        var resArr: any = [];

        const map = new Map();
        for (const item of this.parse_postmetrics) {
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

    movetostp7() {

        var market_id = localStorage.getItem('market_id');
        var trial = localStorage.getItem('trial');

         

        if ((this.metirc_array.length == []) || (this.metirc_array.length == 0)) {
            this.target_metric_req = false;
        } else {
            this.metrix =[]
            for (var i = 0; i <= this.metirc_array.length-1; i++) {
                this.metrix.push(this.metirc_array[i].mmid)        
           }
           this.target_metric_req = true;
        }
        
        if (this.model1) {
            this.stdate = this.model1.year + '-' + this.model1.month + '-' + this.model1.day;
        }
        if (this.model2) {
            this.enddate = this.model2.year + '-' + this.model2.month + '-' + this.model2.day;
        }

        if (this.model3) {
            this.stdate1 = this.model3.year + '-' + this.model3.month + '-' + this.model3.day;
        }
        if (this.model4) {
            this.enddate1 = this.model4.year + '-' + this.model4.month + '-' + this.model4.day;
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

        if (this.stdate1) {
            this.startdt1_req = true;
        } else {
            this.startdt1_req = false;
        }

        if (this.enddate1) {
            this.enddt1_req = true;
        } else {
            this.enddt1_req = false;
        }
		
		let FromMeasurement = localStorage.getItem('FromMeasurement')
		if(FromMeasurement =='0')
		    this.storeMap = null
        else
            this.storeMap = localStorage.getItem('Measurementdata')

					
        let data: any = {
            preTest: {
                "startDate": this.stdate,
                "endDate": this.enddate
            },
            postTest: {
                "startDate": this.stdate1,
                "endDate": this.enddate1
            },
            trial: "trial_" + trial.toString(),
            metrics: this.metrix,
			storeMap : this.storeMap
        }

        if (
            // this.target_metric_req &&
            this.enddt_req &&
            this.startdt1_req &&
            this.startdt_req &&
            this.enddt1_req &&
            this.date_valid &&
            this.date_valid0 &&
            this.date_valid1 &&
            this.target_metric_req == true
        ) {

            this.wizard3service.AnalyseFeature(data).subscribe((apiresponse: any) => {
                if (apiresponse.status == 'ok') {

                    this.parse_measureTest_data = JSON.parse(apiresponse.data.measureTest);
					this.liftcomparison = JSON.parse(apiresponse.data.deltagraph)
					this.variable_name = apiresponse.data.variable
                    let metric = apiresponse.data.metric
                    this.metrix1 = apiresponse.data.metric
                    this.delta1 = apiresponse.data.delta

                    let lift = apiresponse.data.delta
                    let temp_lift:any = [];					
                    for (var i = 0; i <= this.parse_measureTest_data.length - 1; i++) {
                        temp_lift.push({
                            "StoreGroup": this.parse_measureTest_data[i].storeGroup,
							"TestStore": this.parse_measureTest_data[i].testStores,							
                            "ControlstoreNum": this.parse_measureTest_data[i].storeID,
                            "Rank_No": this.parse_measureTest_data[i].rank,
                            // "StoreName": this.parse_measureTest_data[i].storeName,
                            "Variables": this.parse_measureTest_data[i].metric,
                            "Post_Period": this.parse_measureTest_data[i].post_period,
                            "Pre_Period": this.parse_measureTest_data[i].pre_period,
                            "Lift": this.parse_measureTest_data[i].lift							
                        })
                    }

                    var stat_arr: any = []

                    for (var i = 0; i <= metric.length - 1; i++) {

                        if(metric[i]=='-0')
                        {
                            stat_arr.push({
                            'VariableName': this.variable_name[i],
                            'PValue': null,
                            'Lift' : lift[i]
                        });
                        }
                        else
                        {
                        stat_arr.push({
                            'VariableName': this.variable_name[i],
                            'PValue': metric[i],
							'Lift' : lift[i]
                        });
                    }

                    };

                    let temp_teststore: any = []
                    this.testvscntrl_testr = []
                    this.testvscntrl_testr1 =[]
                    for (var i = 0; i <= this.parse_measureTest_data.length - 1; i++) {
                        if (this.parse_measureTest_data[i].storeGroup == "TEST") {
                            if (temp_teststore.find((x: any) => x.id == this.parse_measureTest_data[i].storeID)) {} else {
                                temp_teststore.push({
                                    "id": this.parse_measureTest_data[i].testStores,
                                    "text": this.parse_measureTest_data[i].testStores
                                });
                            }
                        }
                    }

                    this.testvscntrl_teststore = temp_teststore
                    this.testvscntrl_testr1 = temp_teststore

                    this.Variabletoanlyze = this.variable_name
                    this.Variabletoanlyze_lift = this.variable_name
                    this.Stat_Result_Data = stat_arr
                    this.StatResultsdata = this.Stat_Result_Data
                    
                    this.reportlist = temp_lift
                    this.LiftAnalysis_DATA = temp_lift
                    this.LiftAnalysisdata = this.LiftAnalysis_DATA;

                    this.parse_postmetrics = JSON.parse(apiresponse.data.postmetrics);
                    this.no_of_cntrl = apiresponse.data.rank;
                    // this.Filterdatafor_Testore(this.parse_postmetrics);
                    // this.vistest_modelid = this.VisResTeststr[0].id;
                    // this.arr2 = []
                    // this.GetChartdata(this.vistest_modelid, this.parse_postmetrics)


                    this.wizard.goToNextStep();
                    this.showcnt1 = false;
                    this.showcnt2 = true;
                    this.CompletedStep6 = true;
                    this.Metricmodelid = this.metirc_array
                } else {

                }
            });

        }
    }


    movetostp7_saved()
    {
        

        this.showcnt1 = false;
        this.showcnt2 = true;
        this.CompletedStep6 = true;
        this.wizard.goToNextStep();
        
        this.LiftAnalysis_DATA = [];
        this. LiftAnalysisdata = [];
        let temp:any = []
        for(var i=0; i < this.temp_measuredata.length;i++){
          temp.push({
                    "StoreGroup": this.temp_measuredata[i].storeGroup,
                    "TestStore": this.temp_measuredata[i].testStores,                         
                    "ControlstoreNum": this.temp_measuredata[i].storeID,
                    "Rank_No": this.temp_measuredata[i].rank,
                    // "StoreName": this.temp_measuredata[i].storeName,
                    "Variables": this.temp_measuredata[i].metric,
                    "Post_Period": this.temp_measuredata[i].post_period,
                    "Pre_Period": this.temp_measuredata[i].pre_period,
                    "Lift": this.temp_measuredata[i].lift 
                    })   
            }
      

            this.LiftAnalysis_DATA = temp;
            this.LiftAnalysisdata = this.LiftAnalysis_DATA;
    }
    downloadfinalreport()
    {
        
        var market_id = localStorage.getItem('market_id');
        var trial = localStorage.getItem('trial');
        let stgandtrial: any = {
            stage_id: 3,
            trial: trial.toString(),
        }
        let data: any = {
            market_id: market_id,
            stage_id: 3,
            trial: trial,
            /*step 3*/
            measureTest: this.parse_measureTest_data,
            variable: this.variable_name,
            metric: this.metrix1,
            delta: this.delta1,
            postmetrics : this.parse_postmetrics,
            no_of_cntrl : this.no_of_cntrl,
            
            deltagraph: this.liftcomparison,
            pre_start: this.stdate,
            pre_end: this.enddate,
            predays  : this.predays,
            postdays : this.postdays,
            post_start: this.stdate1,
            post_end: this.enddate1,
            measurement_metrix: this.metrix,
            
            /*step 5*/
        };
        var stringified_data = JSON.stringify(data);
        this.wizard3service.SaveStageThree(stgandtrial, stringified_data).subscribe((apiresponse: any) => {
            if (apiresponse.status == 'ok') {
                
                this.wizard3service.downloadreports(trial).subscribe((apiresponse: any) => {
                    if (apiresponse.status == 'ok') {
				     window.location.href = environment.ReportPath + apiresponse.data.filename                

                       //  let message:any = "The " + apiresponse.data.filename + " has been successfully downloaded and can be accessed from the server 10.1.151.122 - home/enduser/TnE/project/Test-and-Execute-Project/backend/datas/trials/trial_"+ trial
                       // var action = 'close';
                       //      this._snackBar.open(message, action, {
                       //          duration: 10000,
                       //          verticalPosition: 'bottom'
                       //      }); 
                    }
                });


            } else {}
        });

    }

    downloadreportonly()
    {
         var trial = localStorage.getItem('trial');
         this.wizard3service.downloadreports(trial).subscribe((apiresponse: any) => {
                    if (apiresponse.status == 'ok') {
                     window.location.href = environment.ReportPath + apiresponse.data.filename                

                       //  let message:any = "The " + apiresponse.data.filename + " has been successfully downloaded and can be accessed from the server 10.1.151.122 - home/enduser/TnE/project/Test-and-Execute-Project/backend/datas/trials/trial_"+ trial
                       // var action = 'close';
                       //      this._snackBar.open(message, action, {
                       //          duration: 10000,
                       //          verticalPosition: 'bottom'
                       //      }); 
                    }
                });
    }

    ontestDeSelect(event: any) {
        this.graphtemp_store = []
        let temp_lift:any =[]
        this.graphtemp_control =[]
        let temp_liftc1:any = []
        let temp_liftc2:any = []
        let temp_liftc3:any = []
        let temp_liftc4:any = []
        let temp_liftc5:any = []
        
        for (var i = 0; i <= this.parse_measureTest_data.length - 1; i++) {

            if ((this.parse_measureTest_data[i].storeGroup == "TEST") && (this.parse_measureTest_data[i].metric == this.testvscntrl_var)) {
                if (this.testvscntrl_testr.find((x: any) => x.text == this.parse_measureTest_data[i].testStores)) {
                    temp_lift.push(this.parse_measureTest_data[i].lift)
                }
            }
        
        if ((this.parse_measureTest_data[i].storeGroup == "CONTROL") && (this.parse_measureTest_data[i].metric == this.testvscntrl_var)) {

                if(this.parse_measureTest_data[i].rank==1)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc1.push(this.parse_measureTest_data[i].lift)
                    }
                }
                if(this.parse_measureTest_data[i].rank==2)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc2.push(this.parse_measureTest_data[i].lift)
                    }
                }
                if(this.parse_measureTest_data[i].rank==3)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc3.push(this.parse_measureTest_data[i].lift)
                    }
                }
                if(this.parse_measureTest_data[i].rank==4)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc4.push(this.parse_measureTest_data[i].lift)
                    }
                }
                if(this.parse_measureTest_data[i].rank==5)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc5.push(this.parse_measureTest_data[i].lift)
                    }
                }
            }
        }
        
       
        let finaltestlift:any;
        finaltestlift = temp_lift.reduce((a:any, b:any) => a + b, 0)        
        finaltestlift = finaltestlift/(temp_lift.length)        
        this.graphtemp_store.push({
                    "name": "Test Store",
                    "y": finaltestlift,
                    "drilldown": "Test Store",
                    "color": '#343434'
        });

        if(temp_liftc1.length>0)
        {
        
        let finalc1lift:any;
        finalc1lift = temp_liftc1.reduce((a:any, b:any) => a + b, 0)
        finalc1lift = finalc1lift/(temp_liftc1.length)
        this.graphtemp_control.push({
                    "name": "Control Store 1",
                    "y": finalc1lift,
                    "drilldown": "Control Store 1",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc2.length>0)
        {

        let finalc2clift:any;
        finalc2clift = temp_liftc2.reduce((a:any, b:any) => a + b, 0)
        finalc2clift = finalc2clift/(temp_liftc2.length)
        this.graphtemp_control.push({
                    "name": "Control Store 2",
                    "y": finalc2clift,
                    "drilldown": "Control Store 2",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc3.length>0)
        {

        let finalc3clift:any;
        finalc3clift = temp_liftc3.reduce((a:any, b:any) => a + b, 0)
        finalc3clift = finalc3clift/(temp_liftc3.length)
        this.graphtemp_control.push({
                    "name": "Control Store 3",
                    "y": finalc3clift,
                    "drilldown": "Control Store 3",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc4.length>0)
        {

        let finalc4clift:any;
        finalc4clift = temp_liftc4.reduce((a:any, b:any) => a + b, 0)
        finalc4clift = finalc4clift/(temp_liftc4.length)
        this.graphtemp_control.push({
                    "name": "Control Store 4",
                    "y": finalc4clift,
                    "drilldown": "Control Store 4",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc5.length>0)
        {

        let finalc5clift:any;
        finalc5clift = temp_liftc5.reduce((a:any, b:any) => a + b, 0)
        finalc5clift = finalc5clift/(temp_liftc5.length)
        this.graphtemp_control.push({
                    "name": "Control Store 5",
                    "y": finalc5clift,
                    "drilldown": "Control Store 5",
                    "color": '#f3aa50'
                });
        }

        setTimeout(() => {
            this.showgraps() }, 100)
        
    }

    resettestmeasure()
    {
        this.model1 = null
        this.model2 = null
        this.model3 = null
        this.model4 = null
        this.Metricmodelid = []
        this.postdays = 0
        this.predays = 0 
        this.metirc_array =[] 
    }
    ontestSelecttable(event:any)
    {
        let temp_lift:any = []; 
        for (var i = 0; i <= this.parse_measureTest_data.length - 1; i++) {
                if (this.testvscntrl_testr1.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_lift.push({
                            "StoreGroup": this.parse_measureTest_data[i].storeGroup,
                            "TestStore": this.parse_measureTest_data[i].testStores,                         
                            "ControlstoreNum": this.parse_measureTest_data[i].storeID,
                            "Rank_No": this.parse_measureTest_data[i].rank,
                            // "StoreName": this.parse_measureTest_data[i].storeName,
                            "Variables": this.parse_measureTest_data[i].metric,
                            "Post_Period": this.parse_measureTest_data[i].post_period,
                            "Pre_Period": this.parse_measureTest_data[i].pre_period,
                            "Lift": this.parse_measureTest_data[i].lift                         
                        })
                }
            }

            this.LiftAnalysis_DATA = temp_lift
            this.LiftAnalysisdata = this.LiftAnalysis_DATA;

    }

    ontestDeSelecttable(event:any)
    {
        let temp_lift:any = []; 
        for (var i = 0; i <= this.parse_measureTest_data.length - 1; i++) {
                if (this.testvscntrl_testr1.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_lift.push({
                            "StoreGroup": this.parse_measureTest_data[i].storeGroup,
                            "TestStore": this.parse_measureTest_data[i].testStores,                         
                            "ControlstoreNum": this.parse_measureTest_data[i].storeID,
                            "Rank_No": this.parse_measureTest_data[i].rank,
                            // "StoreName": this.parse_measureTest_data[i].storeName,
                            "Variables": this.parse_measureTest_data[i].metric,
                            "Post_Period": this.parse_measureTest_data[i].post_period,
                            "Pre_Period": this.parse_measureTest_data[i].pre_period,
                            "Lift": this.parse_measureTest_data[i].lift                         
                        })
                }
            }

            this.LiftAnalysis_DATA = temp_lift
            this.LiftAnalysisdata = this.LiftAnalysis_DATA;
    }

    ontestDeSelectAll(event:any)
    {
        let temp_lift:any = []; 
        this.LiftAnalysis_DATA = temp_lift
        this.LiftAnalysisdata = this.LiftAnalysis_DATA;
    }

    ontestSelectAll(event:any)
    {
         let temp_lift:any = []; 
         for (var i = 0; i <= this.parse_measureTest_data.length - 1; i++) {   
            temp_lift.push({
                            "StoreGroup": this.parse_measureTest_data[i].storeGroup,
                            "TestStore": this.parse_measureTest_data[i].testStores,                         
                            "ControlstoreNum": this.parse_measureTest_data[i].storeID,
                            "Rank_No": this.parse_measureTest_data[i].rank,
                            "Variables": this.parse_measureTest_data[i].metric,
                            "Post_Period": this.parse_measureTest_data[i].post_period,
                            "Pre_Period": this.parse_measureTest_data[i].pre_period,
                            "Lift": this.parse_measureTest_data[i].lift                         
                })               
            }
        this.LiftAnalysis_DATA = temp_lift
        this.LiftAnalysisdata = this.LiftAnalysis_DATA;         
    }


    ontestSelect(event: any) {
        this.graphtemp_store = []
        this.graphtemp_control =[]
        let temp_lift:any =[]
        let temp_liftc1:any = []
        let temp_liftc2:any = []
        let temp_liftc3:any = []
        let temp_liftc4:any = []
        let temp_liftc5:any = []
        
        for (var i = 0; i <= this.parse_measureTest_data.length - 1; i++) {

            if ((this.parse_measureTest_data[i].storeGroup == "TEST") && (this.parse_measureTest_data[i].metric == this.testvscntrl_var)) {
                if (this.testvscntrl_testr.find((x: any) => x.text == this.parse_measureTest_data[i].testStores)) {
                    temp_lift.push(this.parse_measureTest_data[i].lift)
                }
            }


            if ((this.parse_measureTest_data[i].storeGroup == "CONTROL") && (this.parse_measureTest_data[i].metric == this.testvscntrl_var)) {

                if(this.parse_measureTest_data[i].rank==1)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc1.push(this.parse_measureTest_data[i].lift)
                    }
                }
                if(this.parse_measureTest_data[i].rank==2)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc2.push(this.parse_measureTest_data[i].lift)
                    }
                }
                if(this.parse_measureTest_data[i].rank==3)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc3.push(this.parse_measureTest_data[i].lift)
                    }
                }
                if(this.parse_measureTest_data[i].rank==4)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc4.push(this.parse_measureTest_data[i].lift)
                    }
                }
                if(this.parse_measureTest_data[i].rank==5)
                {
                    if (this.testvscntrl_testr.find((x: any) => x.id == this.parse_measureTest_data[i].testStores)) {
                    temp_liftc5.push(this.parse_measureTest_data[i].lift)
                    }
                }
            }
        }
        
       
        let finaltestlift:any;
        finaltestlift = temp_lift.reduce((a:any, b:any) => a + b, 0)        
        finaltestlift = finaltestlift/(temp_lift.length)        
        this.graphtemp_store.push({
                    "name": "Test Store",
                    "y": finaltestlift,
                    "drilldown": "Test Store",
                    "color": '#343434'
        });

        if(temp_liftc1.length>0)
        {
        
        let finalc1lift:any;
        finalc1lift = temp_liftc1.reduce((a:any, b:any) => a + b, 0)
        finalc1lift = finalc1lift/(temp_liftc1.length)
        this.graphtemp_control.push({
                    "name": "Control Store 1",
                    "y": finalc1lift,
                    "drilldown": "Control Store 1",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc2.length>0)
        {

        let finalc2clift:any;
        finalc2clift = temp_liftc2.reduce((a:any, b:any) => a + b, 0)
        finalc2clift = finalc2clift/(temp_liftc2.length)
        this.graphtemp_control.push({
                    "name": "Control Store 2",
                    "y": finalc2clift,
                    "drilldown": "Control Store 2",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc3.length>0)
        {

        let finalc3clift:any;
        finalc3clift = temp_liftc3.reduce((a:any, b:any) => a + b, 0)
        finalc3clift = finalc3clift/(temp_liftc3.length)
        this.graphtemp_control.push({
                    "name": "Control Store 3",
                    "y": finalc3clift,
                    "drilldown": "Control Store 3",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc4.length>0)
        {

        let finalc4clift:any;
        finalc4clift = temp_liftc4.reduce((a:any, b:any) => a + b, 0)
        finalc4clift = finalc4clift/(temp_liftc4.length)
        this.graphtemp_control.push({
                    "name": "Control Store 4",
                    "y": finalc4clift,
                    "drilldown": "Control Store 4",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc5.length>0)
        {

        let finalc5clift:any;
        finalc5clift = temp_liftc5.reduce((a:any, b:any) => a + b, 0)
        finalc5clift = finalc5clift/(temp_liftc5.length)
        this.graphtemp_control.push({
                    "name": "Control Store 5",
                    "y": finalc5clift,
                    "drilldown": "Control Store 5",
                    "color": '#f3aa50'
                });
        }
        setTimeout(() => {
            this.showgraps() }, 100)

        }

        

     

    variableSelect(event: any) {
        let variables = event[0].value
        if(this.loaddatas!=true)
            this.disablestore = false;
        this.grapshow= true;
        this.graphtemp_store = []
		let temp_lift:any = []
        let temp_liftc1:any = []
        let temp_liftc2:any = []
        let temp_liftc3:any = []
        let temp_liftc4:any = []
        let temp_liftc5:any = []

        this.graphtemp_control = []
        for (var i = 0; i <= this.parse_measureTest_data.length - 1; i++) {
            if ((this.parse_measureTest_data[i].storeGroup == "TEST") && (this.parse_measureTest_data[i].metric == variables)) {
                temp_lift.push(this.parse_measureTest_data[i].lift)
            }
            if ((this.parse_measureTest_data[i].storeGroup == "CONTROL") && (this.parse_measureTest_data[i].metric == variables)) {

                if(this.parse_measureTest_data[i].rank==1)
                {
                    temp_liftc1.push(this.parse_measureTest_data[i].lift)
                }
                if(this.parse_measureTest_data[i].rank==2)
                {
                    temp_liftc2.push(this.parse_measureTest_data[i].lift)
                }
                if(this.parse_measureTest_data[i].rank==3)
                {
                    temp_liftc3.push(this.parse_measureTest_data[i].lift)
                }
                if(this.parse_measureTest_data[i].rank==4)
                {
                    temp_liftc4.push(this.parse_measureTest_data[i].lift)
                }
                if(this.parse_measureTest_data[i].rank==5)
                {
                    temp_liftc5.push(this.parse_measureTest_data[i].lift)
                }
            }
        }
        
        let finaltestlift:any;
        finaltestlift = temp_lift.reduce((a:any, b:any) => a + b, 0)
        finaltestlift = finaltestlift/(temp_lift.length)
        this.graphtemp_store.push({
                    "name": "Test Store",
                    "y": finaltestlift,
                    "drilldown": "Test Store",
                    "color": '#343434'
                });
        if(temp_liftc1.length>0)
        {
        
        let finalc1lift:any;
        finalc1lift = temp_liftc1.reduce((a:any, b:any) => a + b, 0)
        finalc1lift = finalc1lift/(temp_liftc1.length)
        this.graphtemp_control.push({
                    "name": "Control Store 1",
                    "y": finalc1lift,
                    "drilldown": "Control Store 1",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc2.length>0)
        {

        let finalc2clift:any;
        finalc2clift = temp_liftc2.reduce((a:any, b:any) => a + b, 0)
        finalc2clift = finalc2clift/(temp_liftc2.length)
        this.graphtemp_control.push({
                    "name": "Control Store 2",
                    "y": finalc2clift,
                    "drilldown": "Control Store 2",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc3.length>0)
        {

        let finalc3clift:any;
        finalc3clift = temp_liftc3.reduce((a:any, b:any) => a + b, 0)
        finalc3clift = finalc3clift/(temp_liftc3.length)
        this.graphtemp_control.push({
                    "name": "Control Store 3",
                    "y": finalc3clift,
                    "drilldown": "Control Store 3",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc4.length>0)
        {

        let finalc4clift:any;
        finalc4clift = temp_liftc4.reduce((a:any, b:any) => a + b, 0)
        finalc4clift = finalc4clift/(temp_liftc4.length)
        this.graphtemp_control.push({
                    "name": "Control Store 4",
                    "y": finalc4clift,
                    "drilldown": "Control Store 4",
                    "color": '#f3aa50'
                });
        }
        if(temp_liftc5.length>0)
        {

        let finalc5clift:any;
        finalc5clift = temp_liftc5.reduce((a:any, b:any) => a + b, 0)
        finalc5clift = finalc5clift/(temp_liftc5.length)
        this.graphtemp_control.push({
                    "name": "Control Store 5",
                    "y": finalc5clift,
                    "drilldown": "Control Store 5",
                    "color": '#f3aa50'
                });
        }
        this.testvscntrl_testr = this.testvscntrl_teststore
        setTimeout(() => {
            this.showgraps() }, 100)

    }

    variableSelect1(event: any) {

        // this.ngZone.run(()=> {

            let variables = event[0].value
            this.graphtemp_store = []
            this.graphtemp_control = []
            this.graphtemp1_store = []
            this.graphtemp12_store =[]
            this.grapshow1= true;
            for (var i = 0; i <= this.liftcomparison.length - 1; i++) {
                if (this.liftcomparison[i].metric == variables) {
                    if(this.liftcomparison[i].testStores !='average')
                    {
                        this.graphtemp1_store.push({
                            "name": this.liftcomparison[i].testStores,
                            "y": this.liftcomparison[i].delta,
                            "drilldown": this.liftcomparison[i].testStores 
                        });
                    }
                    else
                    {
                       this.graphtemp12_store.push({
                            "name": 'Overall Average Test Store Lift',
                            "y": this.liftcomparison[i].delta,
                            "drilldown": this.liftcomparison[i].testStores 
                        }); 
                    }
                }
            }

        // });
        
        setTimeout(() => {
            this.showgraps1()
            this.overallgraph()
            } ,100)
        
    }

    movetostp5() {
        this.wizard.goToNextStep();
        this.showcnt1 = false;
        this.showcnt2 = false;
        this.showcnt3 = true;
        this.match_results();
        setTimeout(() => {
            this.LiftAnalysisdata = this.LiftAnalysis_DATA;
            this.LiftAnalysisDatasrc.sort = this.sort;
        });
    }

    enterStep($event: any) {}
    /*Wizard Navigations*/

    /*DatePicker functions*/
    PreStartDate(date: NgbDate) {
        if (this.model1 && this.model2) {
            // this.predays =
            //     (new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime() -
            //         new Date(this.model1.year + '-' + this.model1.month + '-' + this.model1.day).getTime()) /
            //     (24 * 60 * 60 * 1000);
            // this.predays = Math.round(this.predays / 7);

            // if (this.predays > 0) {
            //     this.date_valid = true;
            // } else {
            //     this.date_valid = false;
            //     this.predays = 0;
            // }


            let datas = {
                "start" : this.model1,
                "end"   : this.model2
            }
            this.wizard3service.GetWeeks(datas).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {                    
                    this.predays = parseInt(apiresponse.data.interval);
                    if (this.predays > 0) {
                        this.date_valid = true;
                    } else {
                        this.date_valid = false;   
                        this.predays =0                     
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

    PreEndDate(date: NgbDate) {
        if (this.model1 && this.model2) {
            // this.predays =
            //     (new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime() -
            //         new Date(this.model1.year + '-' + this.model1.month + '-' + this.model1.day).getTime()) /
            //     (24 * 60 * 60 * 1000);
            // this.predays = Math.round(this.predays / 7);

            // if (this.predays > 0) {
            //     this.date_valid = true;
            // } else {
            //     this.date_valid = false;
            //     this.predays = 0;
            // }

            let datas = {
                "start" : this.model1,
                "end"   : this.model2
            }
            this.wizard3service.GetWeeks(datas).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {                    
                    this.predays = parseInt(apiresponse.data.interval);
                    if (this.predays > 0) {
                        this.date_valid = true;
                    } else {
                        this.date_valid = false;   
                        this.predays =0                     
                    }

                }   
            }
        );

        }

         if (this.model3 && this.model2) {
            // this.postdays1 =
            //     (new Date(this.model3.year + '-' + this.model3.month + '-' + this.model3.day).getTime() -
            //         new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime()) /
            //     (24 * 60 * 60 * 1000);
            // this.postdays1 = Math.round(this.postdays1 / 7);

            // if (this.postdays1 > 0) {
            //     this.date_valid0 = true;
            // } else {
            //     this.date_valid0 = false;
            //     this.postdays1 = 0;
            // }

            let datas = {
                "start" : this.model2,
                "end"   : this.model3
            }
            this.wizard3service.GetWeeks(datas).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {                    
                    this.postdays1 = parseInt(apiresponse.data.interval);
                    if (this.postdays1 > 0) {
                        this.date_valid0 = true;
                    } else {
                        this.date_valid0 = false;   
                        this.postdays1 =0                     
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

    PostStartDate(date: NgbDate) {
        if (this.model3 && this.model4) {
            // this.postdays =
            //     (new Date(this.model4.year + '-' + this.model4.month + '-' + this.model4.day).getTime() -
            //         new Date(this.model3.year + '-' + this.model3.month + '-' + this.model3.day).getTime()) /
            //     (24 * 60 * 60 * 1000);
            // this.postdays = Math.round(this.postdays / 7);

            // if (this.postdays > 0) {
            //     this.date_valid1 = true;
            // } else {
            //     this.date_valid1 = false;
            //     this.postdays = 0;
            // }

            let datas = {
                "start" : this.model3,
                "end"   : this.model4
            }
            this.wizard3service.GetWeeks(datas).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {                    
                    this.postdays = parseInt(apiresponse.data.interval);
                    if (this.postdays > 0) {
                        this.date_valid1 = true;
                    } else {
                        this.date_valid1 = false;   
                        this.postdays =0                     
                    }

                }   
            }
        );

        }

        if (this.model3 && this.model2) {
            // this.postdays1 =
            //     (new Date(this.model3.year + '-' + this.model3.month + '-' + this.model3.day).getTime() -
            //         new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime()) /
            //     (24 * 60 * 60 * 1000);
            // this.postdays1 = Math.round(this.postdays1 / 7);

            // if (this.postdays1 > 0) {
            //     this.date_valid0 = true;
            // } else {
            //     this.date_valid0 = false;
            //     this.postdays1 = 0;
            // }

            let datas = {
                "start" : this.model2,
                "end"   : this.model3
            }
            this.wizard3service.GetWeeks(datas).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {                    
                    this.postdays1 = parseInt(apiresponse.data.interval);
                    
                    if (this.postdays1 > 0) {
                        this.date_valid0 = true;
                    } else {
                        this.date_valid0 = false;   
                        
                    }

                }   
            }
        );
        }


        if (this.model3) {
            this.startdt1_req = true;
        } else {
            this.startdt1_req = false;
        }

    }

    PostEndDate(date: NgbDate) {
        if (this.model3 && this.model4) {
            // this.postdays =
            //     (new Date(this.model4.year + '-' + this.model4.month + '-' + this.model4.day).getTime() -
            //         new Date(this.model3.year + '-' + this.model3.month + '-' + this.model3.day).getTime()) /
            //     (24 * 60 * 60 * 1000);
            // this.postdays = Math.round(this.postdays / 7);

            // if (this.postdays > 0) {
            //     this.date_valid1 = true;
            // } else {
            //     this.date_valid1 = false;
            //     this.postdays = 0;
            // }

             let datas = {
                "start" : this.model3,
                "end"   : this.model4
            }
            this.wizard3service.GetWeeks(datas).subscribe(
            (apiresponse: any) => {
                if (apiresponse.status == 'ok') {                    
                    this.postdays = parseInt(apiresponse.data.interval);
                    if (this.postdays > 0) {
                        this.date_valid1 = true;
                    } else {
                        this.date_valid1 = false;   
                        this.postdays =0                     
                    }

                }   
            }
        );
        
        }

        if (this.model4) {
            this.enddt1_req = true;
        } else {
            this.enddt1_req = false;
        }

    }

    /*DatePicker functions*/

    /*download csv*/
    downloadCSV() {
	
		let trai_name = localStorage.getItem('trial_name')
        var options = {
            title: '',
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            useBom: true,
            headers: ['Store Group', 'Test Store ID' ,'Store ID','Rank', 'Measurement Metric','Pre Period', 'Post Period','Percentage Change (%)']
        };
        new Angular5Csv(this.reportlist,  trai_name+'_lift analysis report', options);
    }

    /*download csv*/

    PlostSeries()
    {
        Highcharts.chart('TimePlot', {
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
                    text: this.TimeSeries_metic,
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

    TimeSeriesmetric(event:any)
    {
        this.disablestore_time = false
        var metric  = event[0].value   
        this.TimeSeries_metic= metric
        if(this.Timeseri_teststore)
        {
            this.TimeSeries = true
            var teststoreid = this.Timeseri_teststore;                     
            this.PlotSeriesFunction(teststoreid,metric)
        }
    }

    TimeSeriesstor(event:any) {
        var teststoreid = event[0].value
        this.Timeseri_teststore = teststoreid
        if(this.TimeSeries_metic)
        {            
            this.TimeSeries = true 
            var metric  = this.Timeseri_metix
            this.PlotSeriesFunction(teststoreid,metric)
        }
                   
    }

    PlotSeriesFunction(teststoreid:any,metric:any)
    {
        const groupBy = (key: any) => (array: any) =>
            array.reduce((objectsByKeyValue: any, obj: any) => {
                const value = obj[key];
                objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                return objectsByKeyValue;
            }, {});

        var chart_arr = this.parse_postmetrics;
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
                if(metric == 'Gross Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Gross_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Gross_Sales_control1)                    
                }
                if(metric == 'Transaction Count')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Transaction_Count_test)
                    temp_controlstore1.push(Chart_results[teststoreid][i].Transaction_Count_control1)                    
                }
                if(metric == 'Net Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Net_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Net_Sales_control1)                 
                }                
            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })
        }


        if (this.no_of_cntrl == 2) {
            var temp_controlstore1 = [];
            var temp_controlstore2 = [];

            for (var i = 0; i <= Chart_results[teststoreid].length - 1; i++) {
                this.weekendDate.push(moment(Chart_results[teststoreid][i].wkEndDate).format("DDMMMYYYY"))
                if(metric == 'Gross Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Gross_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Gross_Sales_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Gross_Sales_control2)
                }
                if(metric == 'Transaction Count')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Transaction_Count_test)
                    temp_controlstore1.push(Chart_results[teststoreid][i].Transaction_Count_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Transaction_Count_control2)
                }
                if(metric == 'Net Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Net_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Net_Sales_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Net_Sales_control2)                   
                }
            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_2 + " (Control Store 2)",
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
                if(metric == 'Gross Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Gross_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Gross_Sales_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Gross_Sales_control2)
                    temp_controlstore3.push(Chart_results[teststoreid][i].Gross_Sales_control3)

                }
                if(metric == 'Transaction Count')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Transaction_Count_test)
                    temp_controlstore1.push(Chart_results[teststoreid][i].Transaction_Count_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Transaction_Count_control2)
                    temp_controlstore3.push(Chart_results[teststoreid][i].Transaction_Count_control3)  
                      
                }
                if(metric == 'Net Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Net_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Net_Sales_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Net_Sales_control2)
                    temp_controlstore3.push(Chart_results[teststoreid][i].Net_Sales_control3)  
                }

            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_2 + " (Control Store 2)",
                "data": temp_controlstore2,
                "color": '#69d420'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_3 + " (Control Store 3)",
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
                if(metric == 'Gross Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Gross_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Gross_Sales_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Gross_Sales_control2)
                    temp_controlstore3.push(Chart_results[teststoreid][i].Gross_Sales_control3)
                    temp_controlstore4.push(Chart_results[teststoreid][i].Gross_Sales_control4)

                }
                if(metric == 'Transaction Count')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Transaction_Count_test)
                    temp_controlstore1.push(Chart_results[teststoreid][i].Transaction_Count_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Transaction_Count_control2)
                    temp_controlstore3.push(Chart_results[teststoreid][i].Transaction_Count_control3) 
                    temp_controlstore4.push(Chart_results[teststoreid][i].Transaction_Count_control4) 
                      
                }
                if(metric == 'Net Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Net_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Net_Sales_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Net_Sales_control2)
                    temp_controlstore3.push(Chart_results[teststoreid][i].Net_Sales_control3) 
                    temp_controlstore4.push(Chart_results[teststoreid][i].Net_Sales_control4) 
                }

            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_2 + " (Control Store 2)",
                "data": temp_controlstore2,
                "color": '#69d420'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_4 + " (Control Store 3)",
                "data": temp_controlstore3,
                "color": '#c128f6'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_5 + " (Control Store 4)",
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
                if(metric == 'Gross Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Gross_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Gross_Sales_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Gross_Sales_control2)
                    temp_controlstore3.push(Chart_results[teststoreid][i].Gross_Sales_control3)
                    temp_controlstore4.push(Chart_results[teststoreid][i].Gross_Sales_control4)
                    temp_controlstore5.push(Chart_results[teststoreid][i].Gross_Sales_control5)

                }
                if(metric == 'Transaction Count')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Transaction_Count_test)
                    temp_controlstore1.push(Chart_results[teststoreid][i].Transaction_Count_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Transaction_Count_control2)
                    temp_controlstore3.push(Chart_results[teststoreid][i].Transaction_Count_control3) 
                    temp_controlstore4.push(Chart_results[teststoreid][i].Transaction_Count_control4) 
                    temp_controlstore5.push(Chart_results[teststoreid][i].Transaction_Count_control5)
                      
                }
                if(metric == 'Net Sales')
                {
                    teststores_sales.push(Chart_results[teststoreid][i].Net_Sales_test)  
                    temp_controlstore1.push(Chart_results[teststoreid][i].Net_Sales_control1)
                    temp_controlstore2.push(Chart_results[teststoreid][i].Net_Sales_control2)
                    temp_controlstore3.push(Chart_results[teststoreid][i].Net_Sales_control3) 
                    temp_controlstore4.push(Chart_results[teststoreid][i].Net_Sales_control4)
                    temp_controlstore5.push(Chart_results[teststoreid][i].Net_Sales_control5) 
                }

            }

            Final_Chart.push({
                "name": Chart_results[teststoreid][0].testStores + " (Test Store)",
                "data": teststores_sales,
                "color": '#0070ff'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_1 + " (Control Store 1)",
                "data": temp_controlstore1,
                "color": '#ff7800'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_2 + " (Control Store 2)",
                "data": temp_controlstore2,
                "color": '#69d420'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_3 + " (Control Store 3)",
                "data": temp_controlstore3,
                "color": '#c128f6'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_4 + " (Control Store 4)",
                "data": temp_controlstore4,
                "color": '#f4ff45'
            })
            Final_Chart.push({
                "name": Chart_results[teststoreid][0].controlStores_5 + " (Control Store 5)",
                "data": temp_controlstore5,
                "color": '#009999'
            })
        }

        this.arr2 = Final_Chart;
        this.TimeSeries =true;

        setTimeout(()=>{
            this.PlostSeries()    
        },300)

    }


    match_results() {
        this.show_match_results = true;
        this.show_visualize_results = true;
        this.show_statistical_results = false;
    }

    visulaize_results() {
        this.show_match_results = false;
        this.show_visualize_results = false;
        this.show_statistical_results = false;
    }

    showgraps() {
        var arr:any=[];
         // var test_cntrl = arr.concat(this.graphtemp_store, this.graphtemp_control);
        // Create the chart
        Highcharts.chart('liftanalysis', {
            chart: {
                type: 'column',
                backgroundColor: '#FFFFFF',
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            xAxis: {
      //       categories: [
      //   'Jan',
      //   'Feb',
      //   'Mar',
      // ],

      crosshair: true,
                type: 'category',
                gridLineDashStyle: 'LongDash',
                gridLineColor: '#FAFAFA',
                max: this.graphtemp_control.length,
                gridLineWidth: 1,
                labels: {
                    style: {
                        fontSize: '18px',
                        fontFamily: 'arial',
                         color: '#778899',
                    },
                    align:'left'
                },

                title: {
                    text: '',
                    style: {
                        color: '#778899',
                        fontSize: '15px',
                        fill: '#778899',
                        fontFamily: 'arial'
                    }
                }
            },
            yAxis: {
                gridLineWidth: 2,
                gridLineDashStyle: 'LongDash',
                gridLineColor: '#FAFAFA',
                title: {
                    text: 'Percentage change (Pre vs Post)',
                    style: {
                        color: '#778899',
                        fontSize: '16px',
                        fill: '#778899',
                        fontFamily: 'arial'
                    }
                }
            },
            legend: {
                enabled: true,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    color: '#778899',
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    fontWeight:'100'
                }
            },

            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        crop:false,
                        overflow:"none",
                        format: '{point.y:.1f}%',
                        style: {
                        fontWeight: '100'
                    }                        
                    }
                }
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                headerFormat: '<span style="font-size:20px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: {point.y:.2f}%<br/>'
            },


            series: [{
                    type: undefined,
                    name: 'Test Store',
                    color: '#343434',
                    data: this.graphtemp_store
                },
                {
                    type: undefined,
                    name: 'Control Store',
                    color: '#f3aa50',
                    data: this.graphtemp_control
                }
            ]            
        });         


    }

    showgraps1() {
        //Test comparison analysis
        Highcharts.chart('teststorecomp', {
            chart: {
                type: 'column',
                backgroundColor: '#FFFFFF'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            xAxis: {
                type: 'category',
                gridLineDashStyle: 'LongDash',
                gridLineColor: '#FAFAFA',
                gridLineWidth: 2,
                labels: {
                    style: {
                        fontSize: '15px',
                        fontFamily: 'arial',
                        color: '#778899',
                    }
                },

                title: {
                    text: '',
                    style: {
                        color: '#778899',
                        fontSize: '15px',
                        fill: '#778899'
                    }
                }
            },
            yAxis: {
                gridLineWidth: 2,
                gridLineDashStyle: 'LongDash',
                gridLineColor: '#FAFAFA',
                title: {
                    text: 'Lift',
                    style: {
                        color: '#778899',
                        fontSize: '16px',
                        fill: '#778899',
                        fontFamily: 'arial'
                    }
                }
            },
            legend: {
                enabled: false,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    color: '#778899',
                    fontFamily: 'Arial',
                    fontSize: '16px',
                }
            },

            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        crop:false,
                        overflow:"none",
                        format: '{point.y:.1f}%',
                        style: {
                            fontWeight: '100'
                        }
                    }
                }
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                headerFormat: '<span style="font-size:20px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>:{point.y:.2f}% <br/>'
            },

            series: [{
                type: undefined,
                name: 'Test Store',
                color: '#343434',
                data: this.graphtemp1_store
            }
            // ,
            // {
            //   type: undefined,
            //   name: 'Overall Average Test Store Lift',
            //   color: '#f3aa50',
            //   data: this.graphtemp12_store
            // }
        ]
        });

    }   


            overallgraph(){
          Highcharts.chart('overallgraph', {
            chart: {
                type: 'column',
            },
            title: {
                text: 'Overall Teststore'
            },
            xAxis: {
                categories: ['Overall Teststore']
            },
            yAxis: {
                title: {
                    text: 'Lift',
                    style: {
                        color: '#778899',
                        fontSize: '16px',
                        fill: '#778899',
                        fontFamily: 'arial'
                    }
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false,
              },
            exporting: {
                enabled: false
              },
            series: [{
                type: undefined,
                name: '',
                data: this.graphtemp12_store,
                color: '#f3aa50'                
            }]
        });
        }

   

    stat_results() {
        this.show_match_results = false;
        this.show_visualize_results = true;
        this.show_statistical_results = true;
    }


    radioChange($event: MatRadioChange) {
        if ($event.source.value === '1') {
            //this.show_uploadstore=true;
            this.Testvscontrol = false;
            this.Teststorelift = true;
            this.Time_series = true
            this.TimeSeries = false
            this.Teststorecomp = true;
            this.grapshow1 = false
            this.teststrlift_var = null
            this.TimeSeries = false;
        } else if($event.source.value === '2') {
            //this.show_uploadstore=false;
            this.Testvscontrol = true;
            this.Time_series = true
            this.TimeSeries = false
            this.grapshow = false
            this.testvscntrl_var = null
            this.testvscntrl_testr = []
            this.Teststorelift = false;
            this.Teststorecomp = false;
            this.overall_graph=false;
            this.overallgraph();
            this.TimeSeries = false;
        }
        else
        {
            this.Timeseri_metix = ""
            this.Timeseries_stores = ""
            this.TimeSeries_metic = ""
            this.Timeseri_teststore =""
            this.TimeSeries = false
            this.Time_series = false
            this.Testvscontrol = true;
            this.grapshow = false
            this.grapshow1 = false
            this.testvscntrl_var = null
            this.testvscntrl_testr = []
            this.Teststorelift = true;
            this.Teststorecomp = false;
            this.overall_graph=false;  
            this.TimeSeries = false;          
        }
    }

    log(event: any) {}

    sortDataMatchvals(sort: Sort) {
        const data = this.LiftAnalysisdata.slice();
        if (!sort.active || sort.direction === '') {
            this.LiftAnalysisdata = data;
            return;
        }

        this.LiftAnalysisdata = data.sort((a: any, b: any) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'StoreGroup':
                    return compare_store(a.StoreGroup, b.StoreGroup, isAsc);
                case 'ControlstoreNum':
                    return compare_store(a.ControlstoreNum, b.ControlstoreNum, isAsc);
                case 'Rank_No':
                    return compare_store(a.Rank_No, b.Rank_No, isAsc);
                case 'StoreName':
                    return compare_store(a.StoreName, b.StoreName, isAsc);
                case 'Variables':
                    return compare_store(a.Variables, b.Variables, isAsc);
                case 'Post_Period':
                    return compare_store(a.Post_Period, b.Post_Period, isAsc);
                case 'Pre_Period':
                    return compare_store(a.Pre_Period, b.Pre_Period, isAsc);
                case 'Lift':
                    return compare_store(a.Lift, b.Lift, isAsc);

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
}

function compare_store(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compare_statrslt(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}