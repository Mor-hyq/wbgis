import print from 'print-js'
export default {
  methods: {
    handlePrint(ismult = false, idx) {
      const printId = ismult ? 'print-table-' + idx : 'print-table'
      print({
        printable: printId,
        type: 'html',
        // maxWidth: 1092,
        style: '@media print{@page {size:portrait;margin:10px auto;}}.print-table{border-collapse:collapse;margin:0 auto}.print-table.medium-width th{width:120px}.print-table.small-width th{width:100px}.print-table caption{margin-bottom:10px;font-size: 16px;font-weight: bold;}.print-table th{width:80px}.print-table th,.print-table td{border:1px solid #666;padding:8px 5px}.print-table td{text-align:center}.print-table .all-col{text-align:left;padding:20px 10px}.print-table .all-col div{white-space:pre;padding-left:2em}.print-table .cus-tit{display:inline-block;width:30%}.print-table .cus-tit:last-child{width:40%;text-align:right}.print-table .cus-tit span{font-weight:normal;font-size:16px}.print-table thead {font-size: 16px;font-weight: bold;}.print-table thead th{border: none;}'

      })
    }
  }
}
