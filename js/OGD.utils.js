(function () {
	"use strict";

	Array.prototype.max = function() {
      return Math.max.apply(null, this)
    }

    Array.prototype.min = function() {
      return Math.min.apply(null, this)
    }

	window.OGD = window.OGD || {};
	window.OGD.utils = {

		getRowWithMaxValueByColumnIndex : function (array, columnIndex, start) {
			var i = 0, 
				ii = array.length,
				maxValue = 0,
				maxRowIndex = -1,
				row = null, 
				value = 0;

			if (!isNaN(start)) {
				i = start;
			}	

			for (; i < ii; i++) {
				
				row = array[i];
				value = row[columnIndex] * 1;
				
				if (value > maxValue) {					
					maxValue = value;
					maxRowIndex = i;
				}

			}	

			return maxRowIndex;
		},

		getRowsByColumnValue : function (array, columnIndex, value) {
			var i = 1, 
				ii = array.length,
				row = null, 
				result = [];
	

			for (; i < ii; i++) {
				
				if (array[i][columnIndex] === value) {
					result.push(array[i]);
				}
				

			}	

			return result;	
		},

		getSumOfColumnValues : function (array, columnIndex) {
			var i = 1, 
				ii = array.length,
				row = null, 
				value = 0,
				result = 0;
	

			for (; i < ii; i++) {
				value = array[i][columnIndex] * 1;

				if (isNaN(value)) {
					throw new Error('value is not a number');
				}

				result += value;
				
			}	

			return result;	
		},

		getSumOfColumnWithGroupBy : function (array, columnIndex, objGroup) {
			var i = 1, 
				ii = array.length,
				row = null, 
				result = 0;

			var resultatObject = {},
				resultArray = [];

			var groups = [0,1];
			var groupId = '';

			for (; i < ii; i++) {
				groupId = array[i][0] + ':' + array[i][1];

				if (resultatObject[groupId] && !isNaN(resultatObject[groupId]).total) {
					resultatObject[groupId].total += array[i][columnIndex] * 1;
				} else {
					resultatObject[groupId] = {
						'year' : array[i][0],
						'canton' : array[i][1],
						'total' : (array[i][columnIndex] * 1)	
					};
					
				}								
			}	

			_.each(resultatObject, function (value, key, list) {
				resultArray.push(value);	
			})

			return resultArray;
		},

		filterByPropertyValue : function (obj, propertyName, value) {
			var item = null,
				result = [];

            for (item in obj) {
            	
                if (obj.hasOwnProperty(item) && (obj[item][propertyName] + '') === value) {
                    result.push(obj[item]);                     
                }
                
            }	
            return result;
		}

	};
}());