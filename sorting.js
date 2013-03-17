module.exports.MergeSort = MergeSort;


/*
	Runs the mege sort algorithm on the passed in list using the specified compare function
	
	The compare function should take two parameters. It should return -1 if the first parameter
	is less than the second parameter, 0 if they are equal, and 1 if the second parameter is 
	less than the first
*/
function MergeSort(list, compareFunc)
{
	if(list.length <= 1)
	{
		return list;
	}
	
	var left = [];
	var right = [];
	var middle = Math.floor(list.length/2);
	for(var i = 0; i < middle; i++)
	{
		left.push(list[i]);
	}
	for(var i = middle; i < list.length; i++)
	{
		right.push(list[i]);
	}
	left = MergeSort(left, compareFunc);
	right = MergeSort(right, compareFunc);
	
	return Merge(left, right, compareFunc);
}

function Merge(left, right, compareFunc)
{
	var result = [];
	while(left.length > 0 || right.length > 0)
	{
		if(left.length > 0 && right.length > 0)
		{
			//comparFunc must return -1 when the first parameter is
			//less than the second, zero if it's equal, and 1 if the 
			//second param is less
			if(compareFunc(left[0], right[0]) < 0)
			{
				result.push(left[0]);
				left.splice(0, 1);
			}
			else
			{
				result.push(right[0]);
				right.splice(0, 1);
			}
		}
		else if(left.length > 0)
		{
			result.push(left[0]);
				left.splice(0, 1);
		}
		else if(right.length > 0)
		{
			result.push(right[0]);
			right.splice(0, 1);
		}
	}
	return result;
}