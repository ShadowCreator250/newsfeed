/**
 *Default is "0".
 *Set this to "1" for way more output in the console.(warning: it's a lot of output!!!)
 *Set this to "2" for some tests (require 3 <p></p> tags with those id's: "tst1", "tst2" and "tst3").
 */
var dev_tst_mode = 0;

/* <---Don't touch this code in case you know what you're doing!---> */
// Step 1: get the text from the text file

/**
 * @param {String} file_name - The file name with ending
 * @param {String} outputAreaID - The id value of the tag where the blog should go in
 * @param {Boolean} leave_content - If the content, that is already in the blog tag should be left there and the blog should only by appended.
 */
function insertBlog(file_name, outputAreaID, leave_content) {

	if (file_name.includes(".txt", 1)) {

		var txt; //var for text from text file
		var xhr = new XMLHttpRequest(); //get text file
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					console.info("Ajax XMLHttpRequest succeed!");
					console.info("Format: " + "[Object \" + \"object number \" + \": \" + \"title\" + \" | \" + \"date\" + \" | \" + \"time\" + \" | \" + \"text(raw)]");
					if (dev_tst_mode == 1) {
						console.log("raw text from the text file ");
						console.log(xhr.responseText);
					}
					txt = xhr.responseText; //write text from text file in var


					// Step 2: Split the text from the text file on "/y" and save the pieces in the years-array
					var years = txt.split("$$/y");
					years.reverse();
					/* reverse the order of the objects in the years-array
															because in the text file the newest is the last one but on the website the newest should be the first
															optional, depends on your preferences */
					if (dev_tst_mode == 1) {
						console.log("years: ");
						console.log(years);
					}
					var years_entry_array = []; // The HTML of all years with all entries in one array
					var blog = [];
					for (var i = 0; i < years.length; i++) {
						console.info("year " + i + ": ");


						// Step 3: Split the text of every year on "$$/l" and save them into elements of the lineswithJSON-array

						var lineswithJSON = years[i].split("$$/l"); //lineswithJSON is an array of every line of the year i in the text file
						if (dev_tst_mode == 1) {
							console.log("lineswithJSON: ");
							console.log(lineswithJSON);
						}
						if (dev_tst_mode == 2) {
							//Test: differences between .innerHTML and .innerText:
							var p = document.getElementById("tst1");
							p.innerHTML = "Test: differences between .innerHTML and .innerText:<BR><BR>innerHTML: <BR>" + lineswithJSON;
							var p2 = document.getElementById("tst2");
							p2.innerText = "innerText: \n" + lineswithJSON;
						}


						// Step 4: lines is the list of objects, which are created by JSON.parse lineswithJSON (= lines of the year i out of the text file without "/l")

						var lines = [];
						for (var j = 0; j < lineswithJSON.length; j++) {
							lines[j] = JSON.parse(lineswithJSON[j]);
						}
						lines.reverse();
						/* reverse the order of the objects in the lines-array
																		because in the text file the newest is the last one but on the website the newest should be the first
																		optional,depends on your preferences */
						if (dev_tst_mode == 1) {
							console.log("lines: ");
							console.log(lines);
						}


						// Step 5: Save title, text, date and time from every object of lines in an extra array

						var title = [];
						var date = [];
						var time = [];
						var textraw = [];
						var text = [];
						for (var k = 0; k < lines.length; k++) {
							title[k] = lines[k].title;
							date[k] = lines[k].date;
							time[k] = lines[k].time;
							textraw[k] = lines[k].text;
							console.log("Object " + k + ": " + title[k] + " | " + date[k] + " | " + time[k] + " | " + textraw[k]);


							// Step 6: Split the text of every Object on "$$/n" and stick them together with "<BR>"

							text[k] = textraw[k].replace(/\$\$\/n/g, "<BR>");

							// replace ä, ö, ü and ß with the specific Unicode
							text[k] = text[k].replace(/&/g, "&amp;");
							text[k] = text[k].replace(/ä/g, "&auml;");
							text[k] = text[k].replace(/Ä/g, "&Auml;");
							text[k] = text[k].replace(/ö/g, "&ouml;");
							text[k] = text[k].replace(/Ö/g, "&Ouml;");
							text[k] = text[k].replace(/ü/g, "&uuml;");
							text[k] = text[k].replace(/Ü/g, "&Uuml;");
							text[k] = text[k].replace(/ß/g, "&szlig;");

							if (dev_tst_mode == 1) {
								console.log("text[k]: ");
								console.log(text[k]);
							}
						}

						// Test if <BR> works fine:
						if (dev_tst_mode == 2) {
							var p3 = document.getElementById("tst3");
							var p3Text = "";
							p3.innerHTML = "Test if \&lt;BR\&gt; works fine:<BR>";
							for (var l = 0; l < lines.length; l++) {
								p3Text = document.getElementById("tst3").innerHTML;
								p3.innerHTML = p3Text + "Object " + l + ": " + title[l] + " | " + date[l] + " | " + time[l] + " | " + text[l] + "<BR>";
							} // Attention!: it must be .innerHTM , with .innerText <BR> doesn't works
						}


						// Step 7: Prepare the output; Define the HTML format and stick the pieces together

						var headerHTML = []; // the header of an entry: "HEADING date;time"
						var textHTML = []; // the text for every entry with HTML-<p>
						var entry = []; // the whole entry in HTML
						var year_entry = ""; // all entries of the year i
						for (var m = 0; m < lines.length; m++) {
							headerHTML[m] = "<p class=\"header\"> <span class=\"heading\">" + title[m] + " " + "</span><span class=\"date\">" + date[m] + "; " + "</span><span class=\"time\">" + time[m] + "</span> </p>";
							textHTML[m] = "<p class=\"text\">" + text[m] + "</p>";
							entry[m] = "<li class=\"entry\">" + headerHTML[m] + textHTML[m] + "</li>"
							year_entry = year_entry + entry[m];

							if (dev_tst_mode == 1) {
								if (k === lines.length) {
									console.log("headerHTML: ");
									console.log(headerHTML);
									console.log("textHTML: ");
									console.log(textHTML);
									console.log("entry: ");
									console.log(entry);
									console.log("year_entry: ");
									console.log(year_entry);

								}
							}
						}

						years_entry_array[i] = year_entry;
						// The HTML of all years with all entries in one array
						if (dev_tst_mode == 1) {
							if (i === years.length - 1) {
								console.log("years_entry_array: ");
								console.log(years_entry_array);
							}
						}

						console.info("year " + i + " end.");


						// Step 8: The Outputter:

						blog[i] = "<ul class=\"year\">" + years_entry_array[i] + "</ul>"
						// blog is a list of all years with all entries in the predefined HTML format
						var outputArea = document.getElementById(outputAreaID);
						var outputText = "";
						outputText = outputArea.innerHTML;
						/**/
						if (!leave_content) {
							outputArea.innerHTML = blog[i];
						} else {
							outputArea.innerHTML = outputText + blog[i];
						}

					}
					/* end of the for-loop "for ( var i = 0; i < years.length; i++) { " after
							" var years = txt.split("$$/y");
								years.reverse();
							"*/
					console.log("blog: ");
					console.log(blog);



					// Back to Step 1: Error-responses and complete XMLHttpRequest (open and send request)

					console.info("Outputting all the text is done.");

				} // end of "if (xhr.status == 200) {"
				else if (xhr.status == 404) {
					alert("Error 404! File not found!  \n Contact the admin and/or look in the console!");
					console.error("Error 404! File not found!");
				} else {
					alert("There is an error!  \n Contact the admin and/or look in the console!");
					console.error("Error number: " + xhr.status + " !")
				} //some Error-responses if something went wrong with the XMLHttpRequest

			} // end of "if (xhr.readyState == 4) {"

		} // end of "xhr.onreadystatechange = function() {"

		xhr.open("get", file_name, true);
		xhr.send();

	} //end of "if (file_name.includes(".txt", 1)) {"
	else {
		alert("The text file is no *.txt file! Please use a *.txt file or contact the admin!");
		console.error("The Request failed because the text file is no *.txt file!\nPlease use a *.txt file or contact the admin!");
	}
}