import React from "react";
import './Qrcode.css'
import {getTypeTable, QRPointType} from "../utils/qrcodeHandler";
import {rand} from "../utils/util";

function listPoint(props) {
    if (!props.qrcode) return []

    const qrcode = props.qrcode;
    const nCount = qrcode.getModuleCount();
    const typeTable = getTypeTable(qrcode);
    const pointList = new Array(nCount);

    let type = props.params[0];
    let size = props.params[1] / 100;
    let opacity = props.params[2] / 100;
    let posType = props.params[3];
    let id = 0;
    console.log(posType)

    if (size <= 0) size = 1.0

    for (let x = 0; x < nCount; x++) {
        for (let y = 0; y < nCount; y++) {
            if (qrcode.isDark(x, y) == false) continue;

            if (typeTable[x][y] == QRPointType.ALIGN_CENTER || typeTable[x][y] == QRPointType.ALIGN_OTHER || typeTable[x][y] == QRPointType.TIMING) {
                if (type == 0)
                    pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill="black" x={x + (1 - size)/2} y={y + (1 - size)/2}/>)
                else if (type == 1)
                    pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill="black" cx={x + 0.5} cy={y + 0.5}/>)
            }
            else if (typeTable[x][y] == QRPointType.POS_CENTER) {
                if (posType == 0) {
                    pointList.push(<rect width={1} height={1} key={id++} fill="black" x={x} y={y}/>);
                } else if (posType == 1) {
                    pointList.push(<circle key={id++} fill="black" cx={x + 0.5} cy={y + 0.5} r={1.5} />)
                    pointList.push(<circle key={id++} fill="none" strokeWidth="1" stroke="black"  cx={x + 0.5} cy={y + 0.5} r={3} />)
                }
            }
            else if (typeTable[x][y] == QRPointType.POS_OTHER) {
                if (posType == 0) {
                    pointList.push(<rect width={1} height={1} key={id++} fill="black" x={x} y={y}/>);
                }
            }
            else {
                if (type == 0)
                    pointList.push(<rect opacity={opacity} width={size} height={size} key={id++} fill="black" x={x + (1 - size)/2} y={y + (1 - size)/2}/>)
                else if (type == 1)
                    pointList.push(<circle opacity={opacity} r={size / 2} key={id++} fill="black" cx={x + 0.5} cy={y + 0.5}/>)
            }
        }
    }

    return pointList;
}

function calViewBox(props) {
    if (!props.qrcode) return '0 0 0 0';

    const nCount = props.qrcode.getModuleCount();
    return String(-nCount / 5) + ' ' + String(-nCount / 5) + ' ' + String(nCount + nCount / 5 * 2) + ' ' + String(nCount + nCount / 5 * 2);
}

class QrRendererBase extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.setParamInfo) {
            this.props.setParamInfo([
                {
                    key: '信息点样式',
                    default: 0,
                    choices: [
                        "矩形",
                        "圆形"
                    ]
                },
                {
                    key: '信息点缩放',
                    default: 100
                },
                {
                    key: '信息点不透明度',
                    default: 100,
                },
                {
                    key: '定位点样式',
                    default: 0,
                    choices: [
                        "矩形",
                        "圆形"
                    ]
                },
                ]
            );
        }
    }

    render() {
        return (
            <svg className="Qr-item-svg" width="100%" height="100%" viewBox={calViewBox(this.props)} fill="white"
                 xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                {listPoint(this.props)}
            </svg>
        );
    }
}

export default QrRendererBase
