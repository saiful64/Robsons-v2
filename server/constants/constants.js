// styles for report generation for analytics.
const styles = {
    headerDark: {
      fill: {
        fgColor: {
          rgb: '89bae4'
        },
      },
      font: {
        sz: 10,
        bold: false,
        underline: false,
  
      },
      border: {
        top: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        bottom: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        left: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        right: {
          style: 'thin',
          color: { rgb: "000000" }
        }
      }
    },
    cellStyle: {
      fill: {
        fgColor: {
          rgb: 'FFFFCC'
        }
      },
      border: {
        top: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        bottom: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        left: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        right: {
          style: 'thin',
          color: { rgb: "000000" }
        }
      },
      font: {
        sz: 10,
        bold: false,
        underline: false,
  
      },
    },
    cellGray: {
      fill: {
        fgColor: {
          rgb: '0d4e87'
        }
      },
      font: {
        color: {
          rgb: 'FFFFFF'
        },
        sz: 10,
        bold: true,
        underline: false
      },
      border: {
        top: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        bottom: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        left: {
          style: 'thin',
          color: { rgb: "000000" }
        },
        right: {
          style: 'thin',
          color: { rgb: "000000" }
        }
      }
    },
    cellGreen: {
      fill: {
        fgColor: {
          rgb: 'FF00FF00'
        }
      }
    },
    cellMerged: {
      fill: {
        fgColor: {
          rgb: 'FFFFFF'
        }
      }
    },
    cellFont10: {
      font: {
        sz: 10,
        bold: false,
        underline: false
      }
    }
  };

  export default styles;