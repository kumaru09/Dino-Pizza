import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import * as go from 'gojs';
import { DiagramComponent } from 'gojs-angular';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HomeComponent implements OnInit {
  productName = '';
  clicked = [false, false, false, false];
  selectedValue = [0, 0, 0, 0];
  crustOpt = '';
  size = '';
  cheeseOpt = '';

  pizza = [{ id: 1, src: 'assets/img/Hawaiian.png', name: 'ฮาวายเอียน' },
  { id: 2, src: 'assets/img/Superdelux.png', name: 'ซูปเปอร์เดอลุกซ์' },
  { id: 3, src: 'assets/img/SeafoodDelux.png', name: 'ซีฟู้ดคอกเทล' }]
  // init product img
  imageSrc = '/assets/img/Empty.png';

  pizzaCheeses = [{ id: 1, src: '/assets/img/HawaiianwithCheese.png', name: 'ฮาวายเอียน' },
  { id: 2, src: '/assets/img/SuperdeluxwithCheese.png', name: 'ซูปเปอร์เดอลุกซ์' },
  { id: 3, src: '/assets/img/SeafoodDeluxwithCheese.png', name: 'ซีฟู้ดคอกเทล' }]

  pizzaSizes = [{ id: 1, src: '/assets/img/S.png', name: 'เล็ก' },
  { id: 2, src: '/assets/img/M.png', name: 'กลาง' },
  { id: 3, src: '/assets/img/L.png', name: 'ใหญ่' }]

  crustOpts = [{ id: 1, opt: 'หนานุ่ม' }, { id: 2, opt: 'บางกรอบ' }]

  cheeseOpts = [{ id: 1, opt: 'เพิ่มชีส' }, { id: 2, opt: 'ไม่เพิ่มชีส' }]

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef) { }
  ngOnInit(): void {

  }

  onClickMenuBt(imageNameObject: any) {
    this.imageSrc = imageNameObject.src;
    this.productName = imageNameObject.name;
    this.clicked[0] = true;
  }

  onClickCrust(opt: string) {
    this.crustOpt = opt;
    this.clicked[1] = true;
  }

  onClickTopping(opt: string) {
    this.cheeseOpt = opt;
    if (opt === 'เพิ่มชีส') {
      this.pizzaCheeses.forEach(obj => {
        if (obj.name === this.productName) {
          console.log(obj.name);
          this.imageSrc = obj.src;
        }
      })
    }
    // else {
    //   this.pizzaCheeses.forEach(obj => {
    //     if (obj.name === this.productName) {
    //       this.imageSrc = obj.src
    //     }
    //   })
    // }
    this.clicked[2] = true;
  }

  onClickSize(size: string) {
    this.size = size;
    this.clicked[3] = true;
  }

  onClickCancle() {
    this.clicked = [false, false, false, false];
    this.selectedValue = [0, 0, 0, 0];
    this.imageSrc = '/assets/img/Empty.png';
    this.productName = '';
    this.crustOpt = '';
    this.cheeseOpt = '';
    this.size = '';
  }

  //--------------------- dfa ---------------------//

  @ViewChild('myDiagram', { static: true })
  public myDiagramComponent!: DiagramComponent;
  // initialize diagram / templates
  public initDiagram(): go.Diagram {

    const $ = go.GraphObject.make;
    const dia = $(go.Diagram, {
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, // have mouse wheel events zoom in and out instead of scroll up and down

      model: $(go.GraphLinksModel,
        {
          linkKeyProperty: 'key' // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        }
      )
    });

    dia.commandHandler.archetypeGroupData = { key: 'Group', isGroup: true };
    dia.isReadOnly = true;

    // define the Node template
    dia.nodeTemplate =
      $(go.Node, 'Spot',
        {
          desiredSize: new go.Size(100, 100),
        },
        new go.Binding("location", "loc", go.Point.parse), //fix node location 
        $(go.Panel, 'Auto',
          $(go.Shape, 'Circle', { stroke: null, fill: 'lightblue' },
            new go.Binding('fill', 'color') //fill color from nodedata.color
          ),
          $(go.TextBlock, { textAlign: "center" },
            new go.Binding('text'),
            new go.Binding('stroke', 'txtStroke')) // binding to get TextBlock.text from nodedata.text
        ),
      );

    dia.nodeTemplateMap.add("Start",
      $(go.Node, "Spot", { desiredSize: new go.Size(100, 100) },
        new go.Binding("location", "loc", go.Point.parse),
        $(go.Shape, "Circle",
          {
            fill: "#52ce60", /* green */
            stroke: null,
          }),
        $(go.TextBlock, new go.Binding("text"),
          {
            font: "bold 16pt helvetica, bold arial, sans-serif",
            stroke: "whitesmoke"
          })
      )
    );

    dia.nodeTemplateMap.add("End",
      $(go.Node, "Spot", { desiredSize: new go.Size(100, 100) },
        new go.Binding("location", "loc", go.Point.parse),
        $(go.Shape, "Circle",
          {
            fill: "maroon",
            stroke: null,
          },
          new go.Binding("fill", "color")),
        $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(90, 90), strokeWidth: 2, stroke: "whitesmoke" }),
        $(go.TextBlock, new go.Binding("text"),
          {
            font: "bold 18pt helvetica, bold arial, sans-serif",
            stroke: "whitesmoke"
          })
      )
    );

    dia.linkTemplate =
      $(go.Link, { routing: go.Link.AvoidsNodes, corner: 10, curve: go.Link.JumpOver },
        new go.Binding("points"),
        $(go.Shape,      // the link shape
          new go.Binding('stroke'),
          new go.Binding('strokeWidth')),
        $(go.Shape,      // the arrowhead
          { toArrow: 'Standard' },
          new go.Binding('fill'),
          new go.Binding('stroke', 'arrStroke')),
        $(go.TextBlock, 'transition',   // this is a Link label
          { segmentIndex: NaN, background: 'whitesmoke', textAlign: "center" },
          new go.Binding('text'),
          new go.Binding('segmentFraction'),
          new go.Binding('segmentOffset'),
        )
      );

    return dia;
  }

  public diagramNodeData: Array<go.ObjectData> = [
    { key: 0, text: 'Start', loc: '0, 950', category: "Start" },
    { key: 1, text: 'ฮาวายเอียน', loc: '250 600' },
    { key: 2, text: 'ดับเบิ้ลชีส', loc: '250 1400' },
    { key: 3, text: 'ฮาวายเอี้ยน\nหนานุ่ม', loc: '500 400' },
    { key: 4, text: 'ฮาวายเอี้ยน\nบางกรอบ', loc: '500 800' },
    { key: 5, text: 'ดับเบิ้ลชีส\nหนานุ่ม', loc: '750 1200' },
    { key: 6, text: 'ดับเบิ้ลชีส\nบางกรอบ', loc: '750 1600' },
    { key: 7, text: 'ฮาวายเอี้ยน\nหนานุ่ม\nกลาง', loc: '750 300' },
    { key: 8, text: 'ฮาวายเอี้ยน\nหนานุ่ม\nใหญ่', loc: '750 500' },
    { key: 9, text: 'ฮาวายเอี้ยน\nบางกรอบ\nกลาง', loc: '750 700' },
    { key: 10, text: 'ฮาวายเอี้ยน\nบางกรอบ\nใหญ่', loc: '750 900' },
    { key: 11, text: 'ฮาวายเอี้ยน\nหนานุ่ม\nกลาง\nเพิ่มชีส', loc: '1000 300' },
    { key: 12, text: 'ฮาวายเอี้ยน\nหนานุ่ม\nใหญ่\nเพิ่มชีส', loc: '1000 500' },
    { key: 13, text: 'ฮาวายเอี้ยน\nบางกรอบ\nกลาง\nเพิ่มชีส', loc: '1000 700' },
    { key: 14, text: 'ฮาวายเอี้ยน\nบางกรอบ\nใหญ่\nเพิ่มชีส', loc: '1000 900' },
    { key: 15, text: 'ดับเบิ้ลชีส\nหนานุ่ม\nกลาง', loc: '1000 1100' },
    { key: 16, text: 'ดับเบิ้ลชีส\nหนานุ่ม\nใหญ่', loc: '1000 1300' },
    { key: 17, text: 'ดับเบิ้ลชีส\nบางกรอบ\nกลาง', loc: '1000 1500' },
    { key: 18, text: 'ดับเบิ้ลชีส\nบางกรอบ\nใหญ่', loc: '1000 1700' },
    { key: 19, text: 'Trap', loc: '1650 950' },
    { key: 20, text: 'Finish', loc: '1350 950', category: "End" }
  ];
  public diagramLinkData: Array<go.ObjectData> = [
    //from Start (0)
    { key: -1, from: 0, to: 0, segmentFraction: 0.6, points: [75, 955, 75, 925, 25, 925, 25, 955], segmentOffset: new go.Point(0, 30), text: 'หนานุ่ม, บางกรอบ, กลาง, ใหญ่, \nเพิ่มชีส, ไม่เพิ่มชีส, \nConfirm, Cancel, Complete' },
    { key: -2, from: 0, to: 1, segmentFraction: 0.5, points: [95, 975, 250, 650], text: 'ฮาวายเอียน' },
    { key: -3, from: 0, to: 2, segmentFraction: 0.4, points: [95, 1025, 250, 1450], text: 'ดับเบิ้ลชีส' },
    //from ฮาวายเอียน (1)
    { key: -4, from: 1, to: 0, segmentFraction: 0.684, points: [300, 700, 300, 1010, 630, 1010, 630, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -5, from: 1, to: 1, segmentFraction: 0.5, points: [325, 605, 325, 575, 275, 575, 275, 605], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส, เพิ่มชีส,\nไม่เพิ่มชีส, กลาง, ใหญ่,\nConfirm, Complete' },
    { key: -6, from: 1, to: 3, segmentFraction: 0.5, points: [345, 625, 500, 450], text: 'หนานุ่ม' },
    { key: -7, from: 1, to: 4, segmentFraction: 0.5, points: [345, 675, 500, 850], text: 'บางกรอบ' },
    //from ดับเบิ้ลชีส (2)
    { key: -8, from: 2, to: 0, segmentFraction: 0.35, points: [300, 1500, 300, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -9, from: 2, to: 2, segmentFraction: 0.4, points: [325, 1405, 325, 1375, 275, 1375, 275, 1405], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส, เพิ่มชีส,\nไม่เพิ่มชีส, กลาง, ใหญ่,\nConfirm, Complete' },
    { key: -10, from: 2, to: 5, segmentFraction: 0.5, points: [345, 1425, 750, 1250], text: 'หนานุ่ม' },
    { key: -11, from: 2, to: 6, segmentFraction: 0.5, points: [345, 1475, 750, 1650], text: 'บางกรอบ' },      
    //from ฮาวายเอี้ยน หนานุ่ม (3)
    { key: -12, from: 3, to: 0, segmentFraction: 0.678, points: [550, 500, 550, 610, 630, 610, 630, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -13, from: 3, to: 3, segmentFraction: 0.5, points: [575, 405, 575, 375, 525, 375, 525, 405], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส, บางกรอบ,\nเพิ่มชีส, ไม่เพิ่มชีส,\nConfirm, Complete' },
    { key: -14, from: 3, to: 7, segmentFraction: 0.5, points: [595, 425, 750, 350], text: 'กลาง' },
    { key: -15, from: 3, to: 8, segmentFraction: 0.5, points: [595, 475, 750, 550], text: 'ใหญ่' }, 
    //from ฮาวายเอี้ยน บางกรอบ (4)
    { key: -16, from: 4, to: 0, segmentFraction: 0.624, points: [550, 900, 550, 1010, 630, 1010, 630, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -17, from: 4, to: 4, segmentFraction: 0.5, points: [575, 805, 575, 775, 525, 775, 525, 805], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, เพิ่มชีส, ไม่เพิ่มชีส,\nConfirm, Complete' },
    { key: -18, from: 4, to: 9, segmentFraction: 0.5, points: [595, 825, 750, 750], text: 'กลาง' },
    { key: -19, from: 4, to: 10, segmentFraction: 0.5, points: [595, 875, 750, 950], text: 'ใหญ่' }, 
    //from ดับเบิ้ลชีส หนานุ่ม (5)
    { key: -20, from: 5, to: 0, segmentFraction: 0.615, points: [850, 1250, 925, 1250, 925, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -21, from: 5, to: 5, segmentFraction: 0.5, points: [825, 1205, 825, 1175, 775, 1175, 775, 1205], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอี้ยน, ดับเบิ้ลชีส, บางกรอบ,\nเพิ่มชีส, ไม่เพิ่มชีส,\nConfirm, Complete'},
    { key: -22, from: 5, to: 15, segmentFraction: 0.25, points: [845, 1225, 1000, 1150], text: 'กลาง' },
    { key: -23, from: 5, to: 16, segmentFraction: 0.25, points: [845, 1275, 1000, 1350], text: 'ใหญ่' },   
    //from ดับเบิ้ลชีส บางกรอบ (6)
    { key: -24, from: 6, to: 0, segmentFraction: 0.535, points: [850, 1650, 925, 1650, 925, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -25, from: 6, to: 6, segmentFraction: 0.5, points: [825, 1605, 825, 1575, 775, 1575, 775, 1605], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอี้ยน, ดับเบิ้ลชีส, หนานุ่ม,\nเพิ่มชีส, ไม่เพิ่มชีส,\nConfirm, Complete'},
    { key: -26, from: 6, to: 17, segmentFraction: 0.25, points: [845, 1625, 1000, 1550], text: 'กลาง' },
    { key: -27, from: 6, to: 18, segmentFraction: 0.25, points: [845, 1675, 1000, 1750], text: 'ใหญ่' },    
    //from ฮาวายเอี้ยน หนานุ่ม กลาง (7)
    { key: -28, from: 7, to: 0, segmentFraction: 0.722, points: [850, 360, 925, 360, 925, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -29, from: 7, to: 7, segmentFraction: 0.5, points: [825, 305, 825, 275, 775, 275, 775, 305], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ, กลาง,\nไม่เพิ่มชีส, Complete' },
    { key: -30, from: 7, to: 8, segmentFraction: 0.3, points: [755, 370, 730, 370, 730, 520, 760, 520], text: 'ใหญ่' },
    { key: -31, from: 7, to: 11, segmentFraction: 0.5, points: [845, 325, 1005, 325], text: 'เพิ่มชีส' },
    { key: -32, from: 7, to: 20, segmentFraction: 0.3, points: [755, 325, 690, 325, 690, 175, 1300, 175, 1300, 1010, 1350, 1010], text: 'Confirm' }, 
    //from ฮาวายเอี้ยน หนานุ่ม ใหญ่ (8)
    { key: -33, from: 8, to: 0, segmentFraction: 0.7025, points: [845, 575, 925, 575, 925, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -34, from: 8, to: 7, segmentFraction: 0.7, points: [840, 520, 865, 520, 865, 370, 845, 370], text: 'กลาง' },
    { key: -35, from: 8, to: 8, segmentFraction: 0.525, points: [825, 505, 825, 475, 775, 475, 775, 505], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ, ใหญ่,\nไม่เพิ่มชีส, Complete' },
    { key: -36, from: 8, to: 12, segmentFraction: 0.75, points: [845, 525, 1005, 525], text: 'เพิ่มชีส' },
    { key: -37, from: 8, to: 20, segmentFraction: 0.2, points: [760, 580, 690, 580, 690, 610, 1300, 610, 1300, 1010, 1350, 1010], text: 'Confirm' },  
    //from ฮาวายเอี้ยน บางกรอบ กลาง (9)
    { key: -38, from: 9, to: 0, segmentFraction: 0.682, points: [850, 760, 925, 760, 925, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -39, from: 9, to: 9, segmentFraction: 0.525, points: [825, 705, 825, 675, 775, 675, 775, 705], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ, กลาง,\nไม่เพิ่มชีส, Complete' },
    { key: -40, from: 9, to: 10, segmentFraction: 0.3, points: [755, 770, 730, 770, 730, 920, 760, 920], text: 'ใหญ่' },
    { key: -41, from: 9, to: 13, segmentFraction: 0.75, points: [845, 725, 1005, 725], text: 'เพิ่มชีส' },
    { key: -42, from: 9, to: 20, segmentFraction: 0.2525, points: [755, 725, 690, 725, 690, 610, 1300, 610, 1300, 1010, 1350, 1010], text: 'Confirm' },  
    //from ฮาวายเอี้ยน บางกรอบ ใหญ่ (10)
    { key: -43, from: 10, to: 0, segmentFraction: 0.6558, points: [845, 975, 925, 975, 925, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -44, from: 10, to: 9, segmentFraction: 0.7, points: [840, 920, 865, 920, 865, 770, 845, 770], text: 'กลาง' },
    { key: -45, from: 10, to: 10, segmentFraction: 0.525, points: [825, 905, 825, 875, 775, 875, 775, 905], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ, ใหญ่,\nไม่เพิ่มชีส, Complete' },
    { key: -46, from: 10, to: 14, segmentFraction: 0.75, points: [845, 925, 1005, 925], text: 'เพิ่มชีส' },
    { key: -47, from: 10, to: 20, segmentFraction: 0.3, points: [760, 980, 690, 980, 690, 1010, 1350, 1010], text: 'Confirm' },       
    //from ฮาวายเอี้ยน หนานุ่ม กลาง เพิ่มชีส (11)
    { key: -48, from: 11, to: 0, segmentFraction: 0.754, points: [1100, 350, 1250, 350, 1250, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -49, from: 11, to: 7, segmentFraction: 0.5, points: [1000, 350, 850, 350], text: 'ไม่เพิ่มชีส' },
    { key: -50, from: 11, to: 11, segmentFraction: 0.5, points: [1075, 305, 1075, 275, 1025, 275, 1025, 305], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ,\nกลาง, ใหญ่, เพิ่มชีส, Complete' },
    { key: -52, from: 11, to: 20, segmentFraction: 0.1, points: [1095, 325, 1300, 325, 1300, 1010, 1350, 1010], text: 'Confirm' },
    //from ฮาวายเอี้ยน หนานุ่ม ใหญ่ เพิ่มชีส (12)
    { key: -53, from: 12, to: 0, segmentFraction: 0.74, points: [1100, 550, 1250, 550, 1250, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -54, from: 12, to: 8, segmentFraction: 0.25, points: [1000, 550, 850, 550], text: 'ไม่เพิ่มชีส' },
    { key: -55, from: 12, to: 12, segmentFraction: 0.5, points: [1075, 505, 1075, 475, 1025, 475, 1025, 505], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ,\nกลาง, ใหญ่, เพิ่มชีส, Complete' },
    { key: -56, from: 12, to: 20, segmentFraction: 0.126, points: [1095, 525, 1300, 525, 1300, 1010, 1350, 1010], text: 'Confirm' },
    //from ฮาวายเอี้ยน บางกรอบ กลาง เพิ่มชีส (13)
    { key: -57, from: 13, to: 0, segmentFraction: 0.7228, points: [1100, 750, 1250, 750, 1250, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -58, from: 13, to: 9, segmentFraction: 0.25, points: [1000, 750, 850, 750], text: 'ไม่เพิ่มชีส' },
    { key: -59, from: 13, to: 10, segmentFraction: 0.5, points: [1075, 705, 1075, 675, 1025, 675, 1025, 705], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ,\nกลาง, ใหญ่, เพิ่มชีส, Complete' },
    { key: -60, from: 13, to: 20, segmentFraction: 0.17, points: [1095, 725, 1300, 725, 1300, 1010, 1350, 1010], text: 'Confirm' },
    //from ฮาวายเอี้ยน บางกรอบ ใหญ่ เพิ่มชีส (14)
    { key: -61, from: 14, to: 0, segmentFraction: 0.7048, points: [1100, 950, 1250, 950, 1250, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -62, from: 14, to: 10, segmentFraction: 0.25, points: [1000, 950, 850, 950], text: 'ไม่เพิ่มชีส' },
    { key: -63, from: 14, to: 14, segmentFraction: 0.5, points: [1075, 905, 1075, 875, 1025, 875, 1025, 905], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ,\nกลาง, ใหญ่, เพิ่มชีส, Complete' },
    { key: -64, from: 14, to: 20, segmentFraction: 0.3, points: [1095, 925, 1300, 925, 1300, 1010, 1350, 1010], text: 'Confirm' }, 
    //from ดับเบิ้ลชีส หนานุ่ม กลาง (15)
    { key: -65, from: 15, to: 0, segmentFraction: 0.683, points: [1100, 1150, 1250, 1150, 1250, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -66, from: 15, to: 15, segmentFraction: 0.5, points: [1075, 1105, 1075, 1075, 1025, 1075, 1025, 1105], segmentOffset: new go.Point(0, 25), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ,\nกลาง, เพิ่มชีส, ไม่เพิ่มชีส, Complete' },
    { key: -67, from: 15, to: 16, segmentFraction: 0.2, points: [1005, 1170, 980, 1170, 980, 1320, 1010, 1320], text:'ใหญ่' },
    { key: -68, from: 15, to: 20, segmentFraction: 0.28, points: [1095, 1125, 1300, 1125, 1300, 1010, 1350, 1010], text: 'Confirm' },  
    //from ดับเบิ้ลชีส หนานุ่ม ใหญ่ (16)
    { key: -69, from: 16, to: 0, segmentFraction: 0.6565, points: [1090, 1375, 1250, 1375, 1250, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -70, from: 16, to: 15, segmentFraction: 0.8, points: [1090, 1320, 1115, 1320, 1115, 1170, 1095, 1170], text: 'กลาง' },
    { key: -71, from: 16, to: 16, segmentFraction: 0.525, points: [1075, 1305, 1075, 1275, 1025, 1275, 1025, 1305], segmentOffset: new go.Point(0, 30), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ, ใหญ่,\nเพิ่มชีส, ไม่เพิ่มชีส,\nComplete' },
    { key: -72, from: 16, to: 20, segmentFraction: 0.17, points: [1100, 1350, 1300, 1350, 1300, 1010, 1350, 1010], text: 'Confirm' },
    //from ดับเบิ้ลชีส บางกรอบ กลาง (17)
    { key: -73, from: 17, to: 0, segmentFraction: 0.63, points: [1100, 1550, 1250, 1550, 1250, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -74, from: 17, to: 17, segmentFraction: 0.5, points: [1075, 1505, 1075, 1475, 1025, 1475, 1025, 1505], segmentOffset: new go.Point(0, 30), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ,\nกลาง, เพิ่มชีส, ไม่เพิ่มชีส, Complete' },
    { key: -75, from: 17, to: 18, segmentFraction: 0.2, points: [1005, 1570, 980, 1570, 980, 1720, 1010, 1720], text:'ใหญ่' },
    { key: -76, from: 17, to: 20, segmentFraction: 0.13, points: [1095, 1525, 1300, 1525, 1300, 1010, 1350, 1010], text: 'Confirm' },
    //from ดับเบิ้ลชีส บางกรอบ ใหญ่ (18)
    { key: -77, from: 18, to: 0, segmentFraction: 0.594, points: [1090, 1775, 1250, 1775, 1250, 1825, 25, 1825, 25, 1045], text: 'Cancel' },
    { key: -78, from: 18, to: 17, segmentFraction: 0.8, points: [1090, 1720, 1115, 1720, 1115, 1570, 1095, 1570], text: 'กลาง' },
    { key: -79, from: 18, to: 18, segmentFraction: 0.525, points: [1075, 1705, 1075, 1675, 1025, 1675, 1025, 1705], segmentOffset: new go.Point(0, 30), text: 'ฮาวายเอียน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ, ใหญ่,\nเพิ่มชีส, ไม่เพิ่มชีส,\nComplete' },
    { key: -80, from: 18, to: 20, segmentFraction: 0.1, points: [1100, 1750, 1300, 1750, 1300, 1010, 1350, 1010], text: 'Confirm' },
    //from Trap (19)
    { key: -83, from: 19, to: 0, segmentFraction: 0.625, points: [1700, 1050, 1700, 1810, 50, 1810, 50, 1050], text: 'Complete' },
    { key: -84, from: 19, to: 19, segmentFraction: 0.5, points: [1725, 955, 1725, 925, 1675, 925, 1675, 955], segmentOffset: new go.Point(0, 40), text: 'ฮาวายเอี้ยน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ,\nกลาง, ใหญ่,\nเพิ่มชีส, ไม่เพิ่มชีส,\nComfirm, Cancel' },
    //from Finish (20)
    { key: -81, from: 20, to: 0, segmentFraction: 0.586, points: [1400, 1050, 1400, 1810, 50, 1810, 50, 1050], text: 'Complete' },
    { key: -82, from: 20, to: 19, segmentFraction: 0.5, points: [1450, 1000, 1650, 1000], text: 'ฮาวายเอี้ยน, ดับเบิ้ลชีส,\nหนานุ่ม, บางกรอบ,\nกลาง, ใหญ่,\nเพิ่มชีส, ไม่เพิ่มชีส,\nComfirm, Cancel' },
  ];

  public diagramDivClassName: string = 'myDiagramDiv';
  public diagramModelData = { prop: 'value' };
  public skipsDiagramUpdate = false;
  public observedDiagram: any;
  // currently selected node; for inspector
  public selectedNode: go.Node | null = null;

  public ngAfterViewInit() {
    if (this.observedDiagram) return;
    this.observedDiagram = this.myDiagramComponent.diagram;
    this.cdr.detectChanges(); // IMPORTANT: without this, Angular will throw ExpressionChangedAfterItHasBeenCheckedError (dev mode only)

    const appComp: HomeComponent = this;
    // listener for inspector
    this.myDiagramComponent.diagram.addDiagramListener('ChangedSelection', function (e) {
      if (e.diagram.selection.count === 0) {
        appComp.selectedNode = null;
      }
      const node = e.diagram.selection.first();
      if (node instanceof go.Node) {
        appComp.selectedNode = node;
      } else {
        appComp.selectedNode = null;
      }
    });
  } // end ngAfterViewInit

  public currState = 0;

  public selectedPath(buttonName: string) {

    for (let j = 0; j < this.diagramLinkData.length; j++) {

      if (this.diagramLinkData[j].from == this.currState && this.diagramLinkData[j].text.includes(buttonName)) {

        //change link data
        const link = _.cloneDeep(this.diagramLinkData[j]);
        link.stroke = '#52ce60';
        link.strokeWidth = 3;
        link.fill = '#52ce60';
        link.arrStroke = '#52ce60';
        this.diagramLinkData[j] = _.cloneDeep(link);

        //change node data
        const node = _.cloneDeep(this.diagramNodeData[this.diagramLinkData[j].to]);
        node.color = '#52ce60';
        node.txtStroke = 'whitesmoke';
        this.diagramNodeData[this.diagramLinkData[j].to] = _.cloneDeep(node);

        this.currState = this.diagramLinkData[j].to;
        break;

      }
    }
  }

}
