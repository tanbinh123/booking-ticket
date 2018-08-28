/*!
 *  Lang.js for Laravel localization in JavaScript.
 *
 *  @version 1.1.10
 *  @license MIT https://github.com/rmariuzzo/Lang.js/blob/master/LICENSE
 *  @site    https://github.com/rmariuzzo/Lang.js
 *  @author  Rubens Mariuzzo <rubens@mariuzzo.com>
 */
(function(root,factory){"use strict";if(typeof define==="function"&&define.amd){define([],factory)}else if(typeof exports==="object"){module.exports=factory()}else{root.Lang=factory()}})(this,function(){"use strict";function inferLocale(){if(typeof document!=="undefined"&&document.documentElement){return document.documentElement.lang}}function convertNumber(str){if(str==="-Inf"){return-Infinity}else if(str==="+Inf"||str==="Inf"||str==="*"){return Infinity}return parseInt(str,10)}var intervalRegexp=/^({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])$/;var anyIntervalRegexp=/({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/;var defaults={locale:"en"};var Lang=function(options){options=options||{};this.locale=options.locale||inferLocale()||defaults.locale;this.fallback=options.fallback;this.messages=options.messages};Lang.prototype.setMessages=function(messages){this.messages=messages};Lang.prototype.getLocale=function(){return this.locale||this.fallback};Lang.prototype.setLocale=function(locale){this.locale=locale};Lang.prototype.getFallback=function(){return this.fallback};Lang.prototype.setFallback=function(fallback){this.fallback=fallback};Lang.prototype.has=function(key,locale){if(typeof key!=="string"||!this.messages){return false}return this._getMessage(key,locale)!==null};Lang.prototype.get=function(key,replacements,locale){if(!this.has(key,locale)){return key}var message=this._getMessage(key,locale);if(message===null){return key}if(replacements){message=this._applyReplacements(message,replacements)}return message};Lang.prototype.trans=function(key,replacements){return this.get(key,replacements)};Lang.prototype.choice=function(key,number,replacements,locale){replacements=typeof replacements!=="undefined"?replacements:{};replacements.count=number;var message=this.get(key,replacements,locale);if(message===null||message===undefined){return message}var messageParts=message.split("|");var explicitRules=[];for(var i=0;i<messageParts.length;i++){messageParts[i]=messageParts[i].trim();if(anyIntervalRegexp.test(messageParts[i])){var messageSpaceSplit=messageParts[i].split(/\s/);explicitRules.push(messageSpaceSplit.shift());messageParts[i]=messageSpaceSplit.join(" ")}}if(messageParts.length===1){return message}for(var j=0;j<explicitRules.length;j++){if(this._testInterval(number,explicitRules[j])){return messageParts[j]}}var pluralForm=this._getPluralForm(number);return messageParts[pluralForm]};Lang.prototype.transChoice=function(key,count,replacements){return this.choice(key,count,replacements)};Lang.prototype._parseKey=function(key,locale){if(typeof key!=="string"||typeof locale!=="string"){return null}var segments=key.split(".");var source=segments[0].replace(/\//g,".");return{source:locale+"."+source,sourceFallback:this.getFallback()+"."+source,entries:segments.slice(1)}};Lang.prototype._getMessage=function(key,locale){locale=locale||this.getLocale();key=this._parseKey(key,locale);if(this.messages[key.source]===undefined&&this.messages[key.sourceFallback]===undefined){return null}var message=this.messages[key.source];var entries=key.entries.slice();var subKey="";while(entries.length&&message!==undefined){var subKey=!subKey?entries.shift():subKey.concat(".",entries.shift());if(message[subKey]!==undefined){message=message[subKey];subKey=""}}if(typeof message!=="string"&&this.messages[key.sourceFallback]){message=this.messages[key.sourceFallback];entries=key.entries.slice();subKey="";while(entries.length&&message!==undefined){var subKey=!subKey?entries.shift():subKey.concat(".",entries.shift());if(message[subKey]){message=message[subKey];subKey=""}}}if(typeof message!=="string"){return null}return message};Lang.prototype._findMessageInTree=function(pathSegments,tree){while(pathSegments.length&&tree!==undefined){var dottedKey=pathSegments.join(".");if(tree[dottedKey]){tree=tree[dottedKey];break}tree=tree[pathSegments.shift()]}return tree};Lang.prototype._applyReplacements=function(message,replacements){for(var replace in replacements){message=message.replace(new RegExp(":"+replace,"gi"),function(match){var value=replacements[replace];var allCaps=match===match.toUpperCase();if(allCaps){return value.toUpperCase()}var firstCap=match===match.replace(/\w/i,function(letter){return letter.toUpperCase()});if(firstCap){return value.charAt(0).toUpperCase()+value.slice(1)}return value})}return message};Lang.prototype._testInterval=function(count,interval){if(typeof interval!=="string"){throw"Invalid interval: should be a string."}interval=interval.trim();var matches=interval.match(intervalRegexp);if(!matches){throw"Invalid interval: "+interval}if(matches[2]){var items=matches[2].split(",");for(var i=0;i<items.length;i++){if(parseInt(items[i],10)===count){return true}}}else{matches=matches.filter(function(match){return!!match});var leftDelimiter=matches[1];var leftNumber=convertNumber(matches[2]);if(leftNumber===Infinity){leftNumber=-Infinity}var rightNumber=convertNumber(matches[3]);var rightDelimiter=matches[4];return(leftDelimiter==="["?count>=leftNumber:count>leftNumber)&&(rightDelimiter==="]"?count<=rightNumber:count<rightNumber)}return false};Lang.prototype._getPluralForm=function(count){switch(this.locale){case"az":case"bo":case"dz":case"id":case"ja":case"jv":case"ka":case"km":case"kn":case"ko":case"ms":case"th":case"tr":case"vi":case"zh":return 0;case"af":case"bn":case"bg":case"ca":case"da":case"de":case"el":case"en":case"eo":case"es":case"et":case"eu":case"fa":case"fi":case"fo":case"fur":case"fy":case"gl":case"gu":case"ha":case"he":case"hu":case"is":case"it":case"ku":case"lb":case"ml":case"mn":case"mr":case"nah":case"nb":case"ne":case"nl":case"nn":case"no":case"om":case"or":case"pa":case"pap":case"ps":case"pt":case"so":case"sq":case"sv":case"sw":case"ta":case"te":case"tk":case"ur":case"zu":return count==1?0:1;case"am":case"bh":case"fil":case"fr":case"gun":case"hi":case"hy":case"ln":case"mg":case"nso":case"xbr":case"ti":case"wa":return count===0||count===1?0:1;case"be":case"bs":case"hr":case"ru":case"sr":case"uk":return count%10==1&&count%100!=11?0:count%10>=2&&count%10<=4&&(count%100<10||count%100>=20)?1:2;case"cs":case"sk":return count==1?0:count>=2&&count<=4?1:2;case"ga":return count==1?0:count==2?1:2;case"lt":return count%10==1&&count%100!=11?0:count%10>=2&&(count%100<10||count%100>=20)?1:2;case"sl":return count%100==1?0:count%100==2?1:count%100==3||count%100==4?2:3;case"mk":return count%10==1?0:1;case"mt":return count==1?0:count===0||count%100>1&&count%100<11?1:count%100>10&&count%100<20?2:3;case"lv":return count===0?0:count%10==1&&count%100!=11?1:2;case"pl":return count==1?0:count%10>=2&&count%10<=4&&(count%100<12||count%100>14)?1:2;case"cy":return count==1?0:count==2?1:count==8||count==11?2:3;case"ro":return count==1?0:count===0||count%100>0&&count%100<20?1:2;case"ar":return count===0?0:count==1?1:count==2?2:count%100>=3&&count%100<=10?3:count%100>=11&&count%100<=99?4:5;default:return 0}};return Lang});(function(){Lang=new Lang();Lang.setMessages({"en.auth":{"failed":"These credentials do not match our records.","throttle":"Too many login attempts. Please try again in :seconds seconds."},"en.booking":{"admin":{"edit":{"title":"Edit Category"},"list":{"title":"Bookings"},"message":{"del":"Delete Booking Successfull!","del_fail":"Can not Delete Booking. Please check connect database!","empty_data":"No data are bookings","msg_del":"Do you want to delete this Booking?","show":"Welcome to booking detail!","show_fail":"Can not open booking detail!"},"show":{"title":"Booking detail"},"table":{"delete":"Delete","email":"Email","end_time":"End","film":"Film","id":"ID","name":"Full Name","price":"Price","quantity":"Quantity","room":"Room","seat":"Seat","show":"Show","start_time":"Start"},"title":"Booking"}},"en.category":{"admin":{"add":{"back":"Back","cancel":"Cancel","edit":"Edit","message":{"msg_require_name":"Please enter name.","msg_size_name":"Please enter name less than 255 character.","msg_unique_name":"Category name exits please enter another name."},"name":"Name Category","placeholder_name":"Category Name","reset":"Reset","submit":"Submit","title":"Add Category"},"edit":{"title":"Edit Category"},"list":{"title":"List Categories"},"message":{"add":"Create New Category Successfull!","add_fail":"Can not add New Category. Please check connect database!","del":"Delete Category Successfull!","del_fail":"Can not Delete Category. Please check connect database!","edit":"Update Category Successfull!","edit_fail":"Can not edit Category by this Child!","msg_del":"Do you want to delete this Category?"},"table":{"created_at":"Created At","delete":"Delete","edit":"Edit","id":"ID","name":"Name","updated_at":"Updated At"},"title":"Category"}},"en.film":{"admin":{"add":{"back":"Back","cancel":"Cancel","describe":"Describe","director":"Director","edit":"Edit","end_date":"End Date","message":{"require_actor":"Please enter actor.","require_category":"Please enter name category.","require_country":"Please enter country.","require_describe":"Please enter describe.","require_director":"Please enter director.","require_duration":"Please enter duration.","require_end_date":"Please enter end date.","require_image":"Please enter image.","require_name":"Please enter name film.","require_producer":"Please enter producer.","require_start_date":"Please enter start date.","unique_name":"Name film existed please enter another name."},"placeholder_actor":"Enter name actor","placeholder_country":"Enter country","placeholder_describe":"Enter describe","placeholder_director":"Enter director","placeholder_duration":"Enter duration","placeholder_name":"Enter name film","placeholder_producer":"Enter producer","producer":"Producer","reset":"Reset","start_date":"Start Date","submit":"Submit","title":"Add Film"},"edit":{"title":"Edit Film"},"list":{"title":"List Films"},"message":{"add":"Create New Film Successfull!","add_fail":"Can not add New Film. Please check connect database!","del":"Delete Film Successfull!","del_fail":"Can not Delete Film. Please check connect database!","edit":"Update Film Successfull!","edit_fail":"Cannot update by film!","msg_del":"Do you want to delete this Film?"},"table":{"actor":"Actor","country":"Country","delete":"Delete","duration":"Duration","edit":"Edit","id":"ID","image":"Image","name":"Name"},"title":"Film"}},"en.home":{"categories":"Categories","films":"Films","home":"Dashboard","likes":"Likes","message":{"welcome_dashboard":"Welcome to Dashboard"},"title":"Admin Dashboard","users":"Users"},"en.login":{"content":"Booking-Ticket","email":"E-Mail Address","forget":"Forgot Your Password?","logout":"Logout","password":"Password","register":"Register","remember":"Remember me","title":"Login","toggle":"Toggle navigation"},"en.master":{"add_category":"Add Category","add_film":"Add Film","add_schedule":"Add Schedule","add_ticket":"Add Ticket","add_user":"Add User","admin":"Admin","bookings":"Bookings","categories":"Categories","category":"Category","film":"Film","films":"Films","home":"Dashboard","list_booking":"List Bookings","list_category":"List Categories","list_film":"List Films","list_schedule":"List Schedules","list_ticket":"List Tickets","list_user":"List Users","logo":"Booking - Ticket","logout":"Logout","logout_page":"Logout page","mailbox":"Mailbox","manage":"Manager cinema","pages":"Pages","profile":"Profile","schedule":"Schedule","schedules":"Schedules","search":"Search","setting":"Settings","tickets":"Tickets","title":"Admin Dashboard","user_page":"User page","users":"Users"},"en.pagination":{"next":"Next &raquo;","previous":"&laquo; Previous"},"en.passwords":{"password":"Passwords must be at least six characters and match the confirmation.","reset":"Your password has been reset!","sent":"We have e-mailed your password reset link!","token":"This password reset token is invalid.","user":"We can't find a user with that e-mail address."},"en.schedule":{"admin":{"add":{"back":"Back","cancel":"Cancel","choose_film":"Choose film","choose_room":"Choose room","edit":"Edit","end_time":"End time","message":{"require_actor":"Please enter actor.","require_country":"Please enter country.","require_describe":"Please enter describe.","require_director":"Please enter director.","require_duration":"Please enter duration.","require_name":"Please enter name Schedule.","require_producer":"Please enter producer.","unique_name":"Name Schedule existed please enter another name."},"placeholder_actor":"Enter name actor","placeholder_country":"Enter country","placeholder_describe":"Enter describe","placeholder_director":"Enter director","placeholder_duration":"Enter duration","placeholder_producer":"Enter producer","placeholder_time":"25-06-1997 12:36","reset":"Reset","start_time":"Start time","submit":"Submit","title":"Add Schedule"},"edit":{"title":"Edit Schedule"},"list":{"title":"List Schedules"},"message":{"add":"Create New Schedule Successfull!","add_fail":"Can not add New Schedule. Please check connect database!","and":" and ","del":"Delete Schedule Successfull!","del_fail":"Can not Delete Schedule. Please check connect database!","edit":"Update Schedule Successfull!","invalid_time_film":"Film available between: ","msg_del":"Do you want to delete this Schedule?","room_invalid":"Room is not available in this time"},"table":{"available":"Available","booked":"Ticket Booked","delete":"Delete","edit":"Edit","end_time":"End Time","id":"ID","name":"Film","room":"Room","start_time":"Start Time","status":"Status","unavailable":"Unavailable"},"title":"Schedule"}},"en.ticket":{"admin":{"add":{"back":"Back","cancel":"Cancel","choose":"Please choose ID Schedule","edit":"Edit","message":{"require_name":"Please enter type ticket.","require_price":"Please enter price ticket.","valid_price":"Price is a number."},"placeholder_price":"Ticket Price","placeholder_type":"Ticket Type","reset":"Reset","submit":"Submit","title":"Add Ticket","type":"Ticket Type"},"edit":{"title":"Edit Ticket"},"list":{"title":"List Ticket"},"message":{"add":"Create New Ticket Successfull!","add_fail":"Can not add New Ticket. Please check connect database!","del":"Delete Ticket Successfull!","del_fail":"Can not Ticket Category. Please check connect database!","edit":"Update Ticket Successfull!","edit_fail":"Can not edit Ticket by this Child!","msg_del":"Do you want to delete this Ticket?","valid_type":"The type Ticket existed into schedule ID"},"table":{"delete":"Delete","edit":"Edit","id":"ID","name_film":"Name Film","price":"Price","schedule_id":"ID Schedule","type":"Type"},"title":"Ticket"}},"en.user":{"admin":{"add":{"address":"Address","back":"Back","cancel":"Cancel","edit":"Edit","email":"Email","female":"Female","gender":"Gender","male":"Male","message":{"add_error":"Create user fail, try again.","add_invalid_phone":"Please enter valid phone.","add_success":"Create new user successfully!","max_password":"The password must be at least 8 characters.","require_address":"Please enter valid address.","require_email":"Please enter email.","require_full_name":"Please enter full name.","require_password":"Please enter password.","unique_email":"This email linked to another account."},"name":"Full name","password":"Password","phone":"Phone","placeholder_address":"Enter your address","placeholder_email":"Enter email address","placeholder_name":"Enter full name","placeholder_password":"Enter password","placeholder_phone":"Enter phone","reset":"Reset","submit":"Submit","title":"Add User"},"edit":{"message":{"edit_error":"Edit user fail, try again.","edit_success":"Update user successfully!"},"title":"Edit User"},"list":{"title":"List Users"},"message":{"add":"Create New User Successfull!","add_fail":"Can not add New User. Please check connect database!","del":"Do you want to delete this User?","del_fail":"Delete user failed.","del_success":"Delete user successfully!","edit":"Update User Successfull!"},"table":{"active":"Active","address":"Address","admin":"Admin","created_at":"Created At","delete":"Delete","edit":"Edit","email":"Email","id":"ID","inactive":"Inactive","is_active":"Status","last_login":"Last logged","name":"Full name","phone":"Phone","role":"Role","updated_at":"Updated At","user":"User"},"title":"User"}},"en.user.index":{"add_cart":"Book Ticket","feature_film":"Feature Films","new_film":"New Films"},"en.user.layout":{"about":"About Us","account":"My account","author":"Company Name \u00a9 All rights Reseverd","cart":"Cart","categories":"Categories","checkout":"Checkout","contact":"Contact","contact_us":"Contact Us","custom_service":"Customer Service","empty":"empty","empty_movie":"you have no items in your Shopping cart","follow":"Follow Us","follows":"Followers","help":"Help","home":"Home","information":"Information","login":"Login","logout":"Logout","order_return":"Orders and Returns","page_name":"Movie Store","profile":"Profile","register":"Register","schedule":"Schedule","search":"Search for a movie...","sign_in":"Sign In","track_order":"Track Orders","view_cart":"View Cart","why_buy":"Why buy from us"},"en.user.login":{"address":"An Hai Bac, Son Tra, Da Nang","country":"Viet Nam","email":"Email","facebook":"Facebook","fax":"Fax","fax_number":"(00) 224 665 999","find_us_here":"Find Us Here","follow":"Follow on","form":{"address":"Address","address_hint":"Enter address","email":"E-mail","email_hint":"Email Address","forgot_password":"Forgot Password?","full_name":"Full Name","full_name_hint":"Enter fullname","login":"Login","password":"Password","password_hint":"Password","phone":"Phone","phone_hint":"Enter phone","register":"Register","repassword":"Confirm Password","repassword_hint":"Confirm password","view":"View Larger Map"},"information":"Information","login_form":"Login Form","phone":"Phone","phone_number":"(00) 222 666 444","register_form":"Register Form","street":"Block 4, An Don","twitter":"Twitter"},"en.user.map":{"href":"https:\/\/maps.google.co.in\/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=Lighthouse+Point,+FL,+United+States&amp;aq=4&amp;oq=light&amp;sll=26.275636,-80.087265&amp;sspn=0.04941,0.104628&amp;ie=UTF8&amp;hq=&amp;hnear=Lighthouse+Point,+Broward,+Florida,+United+States&amp;t=m&amp;z=14&amp;ll=26.275636,-80.087265","src":"https:\/\/maps.google.co.in\/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=Lighthouse+Point,+FL,+United+States&amp;aq=4&amp;oq=light&amp;sll=26.275636,-80.087265&amp;sspn=0.04941,0.104628&amp;ie=UTF8&amp;hq=&amp;hnear=Lighthouse+Point,+Broward,+Florida,+United+States&amp;t=m&amp;z=14&amp;ll=26.275636,-80.087265&amp;output=embed"},"en.user.title":{"title":{"detail":"Detail Film","film":"Infomation Film","index":"Movie Store","login":"Login","register":"Register"}},"en.validation":{"accepted":"The :attribute must be accepted.","active_url":"The :attribute is not a valid URL.","after":"The :attribute must be a date after :date.","after_or_equal":"The :attribute must be a date after or equal to :date.","alpha":"The :attribute may only contain letters.","alpha_dash":"The :attribute may only contain letters, numbers, and dashes.","alpha_num":"The :attribute may only contain letters and numbers.","array":"The :attribute must be an array.","attributes":[],"before":"The :attribute must be a date before :date.","before_or_equal":"The :attribute must be a date before or equal to :date.","between":{"array":"The :attribute must have between :min and :max items.","file":"The :attribute must be between :min and :max kilobytes.","numeric":"The :attribute must be between :min and :max.","string":"The :attribute must be between :min and :max characters."},"boolean":"The :attribute field must be true or false.","confirmed":"The :attribute confirmation does not match.","custom":{"attribute-name":{"rule-name":"custom-message"}},"date":"The :attribute is not a valid date.","date_format":"The :attribute does not match the format :format.","different":"The :attribute and :other must be different.","digits":"The :attribute must be :digits digits.","digits_between":"The :attribute must be between :min and :max digits.","dimensions":"The :attribute has invalid image dimensions.","distinct":"The :attribute field has a duplicate value.","email":"The :attribute must be a valid email address.","exists":"The selected :attribute is invalid.","file":"The :attribute must be a file.","filled":"The :attribute field must have a value.","gt":{"array":"The :attribute must have more than :value items.","file":"The :attribute must be greater than :value kilobytes.","numeric":"The :attribute must be greater than :value.","string":"The :attribute must be greater than :value characters."},"gte":{"array":"The :attribute must have :value items or more.","file":"The :attribute must be greater than or equal :value kilobytes.","numeric":"The :attribute must be greater than or equal :value.","string":"The :attribute must be greater than or equal :value characters."},"image":"The :attribute must be an image.","in":"The selected :attribute is invalid.","in_array":"The :attribute field does not exist in :other.","integer":"The :attribute must be an integer.","ip":"The :attribute must be a valid IP address.","ipv4":"The :attribute must be a valid IPv4 address.","ipv6":"The :attribute must be a valid IPv6 address.","json":"The :attribute must be a valid JSON string.","lt":{"array":"The :attribute must have less than :value items.","file":"The :attribute must be less than :value kilobytes.","numeric":"The :attribute must be less than :value.","string":"The :attribute must be less than :value characters."},"lte":{"array":"The :attribute must not have more than :value items.","file":"The :attribute must be less than or equal :value kilobytes.","numeric":"The :attribute must be less than or equal :value.","string":"The :attribute must be less than or equal :value characters."},"max":{"array":"The :attribute may not have more than :max items.","file":"The :attribute may not be greater than :max kilobytes.","numeric":"The :attribute may not be greater than :max.","string":"The :attribute may not be greater than :max characters."},"mimes":"The :attribute must be a file of type: :values.","mimetypes":"The :attribute must be a file of type: :values.","min":{"array":"The :attribute must have at least :min items.","file":"The :attribute must be at least :min kilobytes.","numeric":"The :attribute must be at least :min.","string":"The :attribute must be at least :min characters."},"not_in":"The selected :attribute is invalid.","not_regex":"The :attribute format is invalid.","numeric":"The :attribute must be a number.","present":"The :attribute field must be present.","regex":"The :attribute format is invalid.","required":"The :attribute field is required.","required_if":"The :attribute field is required when :other is :value.","required_unless":"The :attribute field is required unless :other is in :values.","required_with":"The :attribute field is required when :values is present.","required_with_all":"The :attribute field is required when :values is present.","required_without":"The :attribute field is required when :values is not present.","required_without_all":"The :attribute field is required when none of :values are present.","same":"The :attribute and :other must match.","size":{"array":"The :attribute must contain :size items.","file":"The :attribute must be :size kilobytes.","numeric":"The :attribute must be :size.","string":"The :attribute must be :size characters."},"string":"The :attribute must be a string.","timezone":"The :attribute must be a valid zone.","unique":"The :attribute has already been taken.","uploaded":"The :attribute failed to upload.","url":"The :attribute format is invalid."}});})();