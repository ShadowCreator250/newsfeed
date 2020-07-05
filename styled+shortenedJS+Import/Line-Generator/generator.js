	var importBoxCBEle = null;
	var importBoxEle = null;
	var importTextEle = null;
	var titleEle = null;
	var localDateRBEle = null;
	var ownDateRBEle = null;
	var isNormalEntryRBEle = null;
	var isFirstEntryRBEle = null;
	var isNewYearRBEle = null;
	var ownDateBoxEle = null;
	var dayEle = null;
	var monthEle = null;
	var yearEle = null;
	var hourEle = null;
	var minuteEle = null;
	var textEle = null;
	var leftCharsEle = null;
	var outputEle = null;
	var clearFormEle = null;
	var selectDateFormatEle = null;

	var month_shortcut_de = ["Jan.","Feb.","Mrz.","Apr.","Mai","Jun.","Jul.","Aug.","Sep.","Okt.","Nov.","Dez."];
	var month_shortcut_en = ["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."];
	var date_format = -1;
	var entry_is_state = 0; // 0 - normal; 1 - first line of doc; 2 - first of year

function setup() {

	importBoxCBEle = document.getElementById("show_import");
	importBoxEle = document.getElementById('toggleimport');
	importTextEle = document.getElementById("importtext");
	titleEle = document.getElementById("title");
	localDateRBEle = document.getElementById("local_time_date");
	ownDateRBEle = document.getElementById("own_time_date");
	isNormalEntryRBEle = document.getElementById("is_normal_entry");
	isFirstEntryRBEle = document.getElementById("is_first_entry");
	isNewYearRBEle = document.getElementById("is_new_year");
	ownDateBoxEle = document.getElementById('toggleowntime');
	dayEle = document.getElementById("day");
	monthEle = document.getElementById("month");
	yearEle = document.getElementById("year");
	hourEle = document.getElementById("hour");
	minuteEle = document.getElementById("minute");
	textEle = document.getElementById("text");
	leftCharsEle = document.getElementById("left_characters");
	outputEle = document.getElementById("output");
	clearFormEle = document.getElementById("clearForm");
	selectDateFormatEle = document.getElementById("selectDateFormat");

	localDateRBEle.checked = true;
	ownDateRBEle.checked = false;

	isNormalEntryRBEle.checked = true;
	isFirstEntryRBEle.checked = false;
	isNewYearRBEle.checked = false;

	titleEle.value = "";
	textEle.value = "";
	importTextEle.value="";
	outputEle.innerHTML="";
	importBoxCBEle.checked = false;
	toggle_own_time_date();
	update_is_state();
	toggleimport();
	left_characters();
	changeDateFormat();
	monthEle.selectedIndex = 0;
	hourEle.selectedIndex = 0;
};

function toggleimport() {
	if (importBoxCBEle.checked) {
		importBoxEle.classList.remove("hidden");
		importBoxEle.classList.add("visible");
	}
	else {
		importBoxEle.classList.add("hidden");
		importBoxEle.classList.remove("visible");
	}
}

function import2Gen() {
	var semiJSON = importTextEle.value;
	importTextEle.value="";
	importBoxCBEle.checked = false;
	toggleimport();
	var newYearReg = new RegExp(/\$\$\/y/);
	var newPostReg = new RegExp(/\$\$\/l/);
	var newLineReg = new RegExp(/\$\$\/n/);
	var semiJSONFirst4 = semiJSON.substr(0,4);
	var typeOfPost = "";
	var semiJSONwithoutTypeOfPost = "";
	if(semiJSONFirst4 == "$$/y") {
		typeOfPost = "year";
		semiJSONwithoutTypeOfPost = semiJSON.replace(newYearReg, "");
	}
	else if(semiJSONFirst4 == "$$/l") {
		typeOfPost = "line";
		semiJSONwithoutTypeOfPost = semiJSON.replace(newPostReg, "");
	}
	else {
		typeOfPost = "first";
		semiJSONwithoutTypeOfPost = semiJSON;
	}
	semiJSONObj = JSON.parse(semiJSONwithoutTypeOfPost);
	var title = semiJSONObj.title;
	var text = semiJSONObj.text;
	text = text.replace(newLineReg, "\n");
	var time = semiJSONObj.time;
	var timeSplitted = time.split(":");
	var hour = parseInt(timeSplitted[0]);
	var minutes = parseInt(timeSplitted[1]);
	var date = semiJSONObj.date;
	var day, month, year;
	var dateSplitted = [];
	if(/..\...\...../.test(date)) { //DD.MM.YYYY
		date_format = 0;
		dateSplitted = date.split(".");
		day = parseInt(dateSplitted[0]);
		month = parseInt(dateSplitted[1]);
		year = parseInt(dateSplitted[2]);
	}
else if(/....\-..\-../.test(date)) { //YYYY-MM-DD
		date_format = 1;
		dateSplitted = date.split("-");
		year = parseInt(dateSplitted[0]);
		month = parseInt(dateSplitted[1]);
		day = parseInt(dateSplitted[2]);
	}
	else if(/..\/.{3,4}\...../.test(date)) { //DD/MMM/YYYY
		date_format = 4;
		dateSplitted = date.split("/");
		day = parseInt(dateSplitted[0]);
		month = dateSplitted[1];
		year = parseInt(dateSplitted[2]);
		if(month.search(/Mrz\.|Mai|Okt\.|Dez\./)) { //de
			date_format = 2;
			month = month_shortcut_de.indexOf(month) + 1;
		}
		else { //en
			date_format = 3;
			month = month_shortcut_en.indexOf(month) + 1;
		}
	}
	else {
		day = 0;
		month = 0;
		year = 1900;
	}

	titleEle.value = title;
	ownDateRBEle.checked = true;
	toggle_own_time_date();
	if(typeOfPost == "year") {
		isFirstEntryRBEle.checked = false;
		isNewYearRBEle.checked = true;
	}
	else if(typeOfPost == "first") {
		isFirstEntryRBEle.checked = true;
		isNewYearRBEle.checked = false;
	}
	dayEle.value = day;
	monthEle.selectedIndex = month -1;
	yearEle.value = year;
	selectDateFormatEle.selectedIndex = date_format;
	hourEle.selectedIndex = hour;
	minuteEle.value = minutes;
	textEle.value = text;
	left_characters();

}

function changeDateFormat() {
	if(selectDateFormatEle.selectedIndex >= 0 && selectDateFormatEle.selectedIndex < 4) {
		date_format = selectDateFormatEle.selectedIndex;
	}
	else {
		alert("Something went wrong with the declaration of the date format! \nPlease contact the admin/ change the date_format if you're the admin \nand/or take a look into the console");
		console.error("The declaration of the date format is wrong! It must be 0, 1, 2 or 3. But date_format is: " + date_format);

	}
}

function toggle_own_time_date() {
	if (ownDateRBEle.checked) {
		ownDateBoxEle.classList.remove("hidden");
		ownDateBoxEle.classList.add("visible");
		dayEle.value = 0;
		yearEle.value = 0;
		minuteEle.value = 0;
	}
	else if (localDateRBEle.checked) {
		ownDateBoxEle.classList.remove("visible");
		ownDateBoxEle.classList.add("hidden");
	}
/*
	makes the UI for defining your own time and date visible or not
 	depending on if you want to define your own time and date
*/
}

function update_is_state() {
	if (isNormalEntryRBEle.checked) {
		entry_is_state = 0;
	}
	else if (isFirstEntryRBEle.checked) {
		entry_is_state = 1;
	}
	else if (isNewYearRBEle.checked) {
		entry_is_state = 2;
	}
	else {
		entry_is_state = 0;
	}
}

function set_max_days() {
	var leap_year_check = yearEle.value;
	var own_month = monthEle.value - 1;
	var days_max_arr = [31,28,31,30,31,30,31,31,30,31,30,31];
	if (((leap_year_check % 4 == 0) && (leap_year_check % 100 != 0)) || (leap_year_check % 400 == 0)) {
		days_max_arr[1] = 29;
	}
	dayEle.setAttribute("max", days_max_arr[own_month]);
	if (dayEle.value > days_max_arr[own_month]) {
		dayEle.value = days_max_arr[own_month];
	}
/*
	If you have chosen to define your own time and date,
	this function sets the "max"-value for the day-input-field.
	This value depends on the month and if the year is a leap year.
*/
}

function left_characters() {
	var characters = textEle.value.length;
	leftCharsEle.innerHTML = "Characters left:  " + (5000 - characters) + "/5000";
/*
	This function calculate how much characters you have left for the text and displays this number on the website.
*/
};

function validate() {
	// ele.checkValidity();
	if(dayEle.checkValidity() && yearEle.checkValidity() && minuteEle.checkValidity()) {
		gen();
	}
	else {
		outputEle.innerHTML = "<span style=\"color:red;\">Your input data is not valid!<BR>Please check and correct the wrong input!</span>";
	}
}

// this function generates the output:
function gen() {
	var local_time_date = false;
	var own_time_date = false;
	var title = " ";
	var text = " ";
	var hour, minute , month, year, day;
	var output_text = "";

/*
	get the values of the input-fields
	for the radio buttons and the checkboxes: "1" is "checked" and "0" is "not checked"
*/
// the title:
	title = titleEle.value;

// the radio buttons:
	if (localDateRBEle.checked) {
		local_time_date = true;
		own_time_date = false;

/*
	if you want to use the locale time and date, the script gets and defines this here:
	and because it looks more beautiful, some zeros are added if the number is lower than 10
*/
		var date_time = new Date();
		day = date_time.getDate();
		month = date_time.getMonth() + 1;
		year = date_time.getFullYear();
		hour = date_time.getHours();
		minute = date_time.getMinutes();
		if (day < 10) {
			day = "0" + day
		}
		if (month < 10) {
			month = "0" + month
		}
		if (hour < 10) {
			hour = "0" + hour
		}
		if (minute < 10) {
			minute = "0" + minute
		}
	}

	if (ownDateRBEle.checked) {
		own_time_date = true;
		local_time_date = false;	

/*
	If you decided to define your own time and date, the script gets the values here:
	If you doesn't set a value for day, year or minute, the script set those to 0 because then it looks nicer
	and again adds some zeros (for a beautiful look).
	".replace(/0+/,'')"" removes the leading zero's if there are some (prevent trolling and it looks nicer without these).
*/
		day = dayEle.value.replace(/^0+/,'');
		month = monthEle.value;
		year = yearEle.value.replace(/^0+/,'');
		hour = hourEle.value;
		minute = minuteEle.value.replace(/^0+/,'');
		if (day == "") {day = 0;}
		if (year == "") {year = "0000";}
		if (minute == "") {minute = 0;}
		if (day < 10) {
			day = "0" + day
		}
		if (minute < 10) {
			minute = "0" + minute
		}
	}

// the checkboxes:
	update_is_state();

// the text:
	text = textEle.value.split("\n").join("$$/n");
	text = text.split('"').join("&#92;&quot;");
	text = text.split('<').join('&lt;');
	text = text.split('>').join('&gt;');
/*
 	split("\n") and .join("$$/n") are for changing "\n" to "$$/n" (string text to HTML text)
 	and because the new lines in the blog are created with the "$$/n"

	.split('<') and .join('&lt;'); and
	.split('>') and .join('&gt;');
	are for realizing HTML tags (f. e. <a> or <img>)

	.split('"') and .join("&#92;&quot;");
	makes valid quotes and HTML tag attributes possible
*/
	var t = [];
	t[0] = text;

var date_formatted = "";
if (date_format == 0) {
	date_formatted = day + "." + month + "." + year;
}
else if (date_format == 1) {
	date_formatted = year + "-" + month + "-" + day;
}
else if (date_format == 2) {
	date_formatted = day + "/" + month_shortcut_de[(month -1)]  + "/" + year;
}
else if (date_format == 3) {
	date_formatted = day + "/" + month_shortcut_en[(month -1)]  + "/" + year;
}
else {
	alert("Something went wrong with the declaration of the date format! \nPlease contact the admin/ change the date_format if you're the admin \nand/or take a look into the console");
	console.error("The declaration of the date format is wrong! It must be 0, 1, 2 or 3. But date_format is: " + date_format);
} // pre create the date dependent on which date format you have chosen

/*
	creating the output for:
	1. the entry is the first entry of the *.txt document or
	2. the entry is the first entry of a new year or
	3. the entry is just a new entry
*/
	if(entry_is_state == 0) {
	output_text = "$$/l{\"title\":\"" + title + "\",\"text\":\"" + text + "\",\"date\":\"" + date_formatted + "\",\"time\":\"" + hour + ":" + minute + "\"}";
	}
	else if (entry_is_state == 1) {
		output_text = "{\"title\":\"" + title + "\",\"text\":\"" + text + "\",\"date\":\"" + date_formatted + "\",\"time\":\"" + hour + ":" + minute + "\"}";
	}
	else if (entry_is_state == 2) {
		output_text = "$$/y{\"title\":\"" + title + "\",\"text\":\"" + text + "\",\"date\":\"" + date_formatted + "\",\"time\":\"" + hour + ":" + minute + "\"}";
	}
	

	outputEle.innerHTML = output_text;
	// displaying the output

}
