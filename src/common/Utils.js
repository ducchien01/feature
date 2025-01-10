import $ from "jquery";
import { parse, format } from 'date-fns';

var arrayConstructor = [].constructor;
var objectConstructor = ({}).constructor;

export function checkTypeof(object) {
    if (object === null) {
        return "null";
    }
    if (typeof object === "object") {
        if (object.constructor === arrayConstructor) {
            return "array";
        }
        if (object.constructor === objectConstructor) {
            return "object";
        }
    } else {
        return typeof object;
    }
}

export class Ultis {
    static parseDate(dateString) {
        if (dateString.includes('/')) {
            const isYearFirstFormat = /^\d{4}\//.test(dateString);

            if (isYearFirstFormat) {
                // Định dạng 'YYYY/MM/DD', sử dụng constructor Date trực tiếp
                return new Date(dateString).getTime();
            } else {
                // Định dạng 'DD/MM/YYYY', cần chuyển đổi trước khi tạo Date object
                const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
                return new Date(year, month - 1, day).getTime(); // Tháng bắt đầu từ 0 trong JavaScript
            }
        } else {
            return new Date(dateString).getTime();
        }
    }

    static formatDateTime(dateTimeString, time) {
        const dateTime = new Date(dateTimeString);
        const day = String(dateTime.getDate()).padStart(2, '0');
        const month = String(dateTime.getMonth() + 1).padStart(2, '0');
        const year = dateTime.getFullYear();
        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${time === true ? `${hours}:${minutes}` : ""}`;
    }

    static dateTime_stringToDecimal(stringDate) {
        return new Date(stringDate).getTime() / 1000;
    }

    static numberToTime(number, onlyDate) {
        return Ultis.formatDateTime(new Date(number), onlyDate ?? false);
    }

    /// chỉ return ra số
    static validateOnlyNumber = (event) => {
        return event.target.value.replace(/[^0-9]/g, '');
    }
    /// kiểm tra hợp lệ của một số trong input, Nhập vào giá trị hiện tại, số chữ số nguyên lớn nhất, số chữ số thập phân lớn nhất và giá trị lớn nhất của input, nếu thỏa mãn các điều kiện thì mới cho phép nhập tiếp
    static isValid = (value, integer_length, decimal_length, max) => {
        if (`${value}`.length > integer_length && `${value}`.endsWith(".") && `${value}`.split(".").length - 1 === 1) {
            return true
        }
        else if (`${value}`.includes(".")) {
            if (`${value}`.split(".").length - 1 === 1) {
                const [integerPart, decimalPart] = value.split('.');
                if (integerPart.length <= integer_length && decimalPart.length <= decimal_length) {
                    return true;
                } else {
                    return false
                }
            } else {
                return false;
            }
        }
        else {
            if (`${value}`.length <= integer_length) {
                if (max) {
                    return Ultis.tryParseFloat(value) <= max ? true : false;
                }
                return true;
            } else {
                return false;
            }
        }
    }

    static tryParseInt(input) {
        if (input != null && input !== undefined && input !== "") {
            return parseInt(`${input}`.replaceAll(",", ""));
        } else {
            return 0;
        }
    }
    static tryParseFloat(input) {
        if (input != null && input !== undefined && input !== "") {
            return parseFloat(`${input}`.replaceAll(",", ""));
        } else {
            return 0;
        }
    }

    static get_remainingElement(list1, list2, key) {
        const set1 = new Set(list1.map(item => item[key]));
        const set2 = new Set(list2.map(item => item[key]));

        const differenceSet = new Set([...set1].filter(id => !set2.has(id)));
        const list3 = list1.filter(item => differenceSet.has(item[key]));

        return list3;
    }


    static dateDefault = new Date('01/01/2021').getTime();
    static StringDatetoStringDate(date, formatDate, formatInputDate) {
        try {
            if (date) {

                const parsedDate = parse(date, formatInputDate ?? 'dd/MM/yyyy', new Date());
                const formattedDate = format(parsedDate, formatDate ?? 'yyyy-MM-dd');
                return formattedDate;
            } else {
                return '';
            }

        } catch (error) {
            return '';
        }
    }

    static set_timeRefreshToken() {
        var result = new Date(Date.now());
        result.setDate(result.getDate() + 30);
        result.setMinutes(result.getMinutes() - 10);
        // result.setSeconds(result.getSeconds() + 30);
        localStorage.setItem('time_tokenRefresh', result);
    }

    static get_timeRefreshToken() {
        let time = new Date(localStorage.getItem('time_tokenRefresh')).getTime();
        return time;
    }
    static differenceInDays(date1, date2) {
        const differenceInDaysValue = (date1 - date2) / (1000 * 60 * 60 * 24);
        return parseInt(differenceInDaysValue);

    }

    static differenceInMinutes(date1, date2) {
        let diff = (date2.getTime() - date1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));

    }

    static calculateAge = (birthdate) => {
        const parsedBirthdate = parse(birthdate, 'dd/MM/yyyy', new Date());
        if (!isNaN(parsedBirthdate.getTime())) {
            const today = new Date();
            const birthdateThisYear = new Date(today.getFullYear(), parsedBirthdate.getMonth(), parsedBirthdate.getDate());
            let ageYears = today.getFullYear() - parsedBirthdate.getFullYear();
            if (today < birthdateThisYear) {
                ageYears--;
            }
            return ageYears;
        } else {
            return 0;
        }
    };

    static getStringDateNow() {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();

        return `${day} -${month} -${year} `;
    }

    static toMilliSecond(time) {
        return Math.floor(Math.abs(Date.now() - Ultis.dateDefault) - time);
    }
    static toSecond(time) {
        return Math.floor(Math.abs(Date.now() - Ultis.dateDefault) / 1000 - time);
    }
    static toMinus(time) {
        return Math.floor((Math.abs(Date.now() - Ultis.dateDefault) / 1000 - time) / 60);
    }
    static toHours(time) {
        return Math.floor((Math.abs(Date.now() - Ultis.dateDefault) / 1000 - time) / 3600);
    }

    static getTimeEdit(time) {
        if (Ultis.toHours(time) >= 24) {
            return `${Math.floor(Ultis.toHours(time) / 24)} days`;
        } else if (0 < Ultis.toHours(time) && Ultis.toHours(time) < 24) {
            return `${Ultis.toHours(time)} hours`
        } else {
            if (Ultis.toMinus(time) > 0) {
                return `${Ultis.toMinus(time)} minutes`;
            } else {
                return `${Ultis.toSecond(time)} seconds`;
            }
        }
    }

    static money(number) {
        if (number) {
            if (typeof number === "string") {
                return number.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            } else if (!isNaN(number)) {
                number = number.toFixed(2);
                return number.toString().replace(".00", "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
        return 0;
    }

    static moneytmp(number, a) {
        // if (typeof number === "string") number = parseFloat(number);
        var val = (number / 1).toFixed(a)
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    static decimalMoney(input) {
        if (input != null && input !== "" && !isNaN(input)) { }
        else {
            return 0;
        }
    }

    static stringToDate(_date, _format = "dd/MM/yyyy", _delimiter = "/") {
        var dayformat = _format;
        var hourformat = '';
        var day = _date;
        var hours = '';
        var isHour = false;
        if (_format.trim().indexOf(" ") > -1) {
            dayformat = _format.trim().split(" ")[0];
            hourformat = _format.trim().split(" ")[1];
            day = _date.trim().split(" ")[0];
            hours = _date.trim().split(" ")[1];
            isHour = true;
        }
        var formatLowerCase = dayformat.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = day.split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var hour = 0;
        var min = 0;
        var sec = 0;
        if (isHour) {
            var tmpHour = hourformat.split(":");
            var hourindex = tmpHour.indexOf("HH");
            if (hourindex < 0) {
                hourindex = tmpHour.indexOf("hh");
            }
            var mmindex = tmpHour.indexOf("mm");
            var ssindex = tmpHour.indexOf("ss");
            var time = hours.split(":");
            hour = time[hourindex]; min = time[mmindex]; sec = time[ssindex];
        }
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex], hour ?? 0, min ?? 0, sec ?? 0);
        return formatedDate;
    }


    //stringToDate("17/9/2014", "dd/MM/yyyy", "/");
    //stringToDate("9/17/2014", "mm/dd/yyyy", "/")
    //stringToDate("9-17-2014", "mm-dd-yyyy", "-")
    //stringToDate("9-17-2014 14:20:20", "mm-dd-yyyy HH:mm:ss", "-")
    //stringToDate("9-17-2014 02:30:30", "mm-dd-yyyy hh:mm:ss", "-")
    static datetoStringDefault() {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = currentDate.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }

    /** date: dd/mm/yyyy | yyyy/mm/dd | dd/mm | mm/yyyy
        time: hh:mm:ss | hh:mm */
    static datetoString(x = new Date(), y = "dd/mm/yyyy") {
        let splitDateTime = y.split(" ");
        let dateConvert = splitDateTime[0]
        let timeConvert = splitDateTime[1]
        if (dateConvert.includes('hh')) {
            timeConvert = splitDateTime[0]
            dateConvert = splitDateTime[1]
            var startByTime = true
        }
        if (dateConvert) {
            dateConvert = dateConvert.split(y.includes("/") ? "/" : "-").map(type => {
                switch (type.toLowerCase()) {
                    case "dd":
                        return x.getDate() < 10 ? `0${x.getDate()}` : `${x.getDate()}`;
                    case "mm":
                        return (x.getMonth() + 1) < 10 ? `0${(x.getMonth() + 1)}` : `${(x.getMonth() + 1)}`;
                    case "yyyy":
                        return `${x.getFullYear()}`;
                    default:
                        break;
                }
            }).join(y.includes("/") ? "/" : "-");
        }
        if (timeConvert) {
            timeConvert = timeConvert.split(":").map(type => {
                switch (type) {
                    case "hh":
                        return x.getHours() < 10 ? `0${x.getHours()}` : `${x.getHours()}`;
                    case "mm":
                        return x.getMinutes() < 10 ? `0${x.getMinutes()}` : `${x.getMinutes()}`;
                    case "ss":
                        return x.getSeconds() < 10 ? `0${x.getSeconds()}` : `${x.getSeconds()}`;
                    default:
                        break;
                }
            }).join(":")
            if (startByTime) {
                return timeConvert + (dateConvert ? ` ${dateConvert}` : '')
            } else {
                return dateConvert + (timeConvert ? ` ${timeConvert}` : '')
            }
        } else {
            return dateConvert;
        }
    }

    dateDefault = new Date("2022-1-1");

    static setStorage(key, value) {
        localStorage.setItem(key, value);
    }
    static clearStorage() {
        localStorage.clear();
    }
    static getStorage(key) {
        return localStorage.getItem(key);
    }

    static setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static deleteCookie(cname) {
        document.cookie = cname + "=;" + "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    static clearCookie() {
        document.cookie.split(';').forEach(c => {
            this.deleteCookie(c)
        })
    }

    static getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    //1: năm, 2: quý,3: tháng, 4: tuần,5: ngày, 6: giờ, 7: phút, 8: giây
    static dateAdd(date, type, units) {
        if (!(date instanceof Date))
            return undefined;
        var ret = new Date(date);
        var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };
        switch (type) {
            case 1: ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
            case 2: ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
            case 3: ret.setMonth(ret.getMonth() + units); checkRollover(); break;
            case 4: ret.setDate(ret.getDate() + 7 * units); break;
            case 5: ret.setDate(ret.getDate() + units); break;
            case 6: ret.setTime(ret.getTime() + units * 3600000); break;
            case 7: ret.setTime(ret.getTime() + units * 60000); break;
            case 8: ret.setTime(ret.getTime() + units * 1000); break;
            default: ret = undefined; break;
        }
        return ret;
    }

    static removeStorage(key) {
        return localStorage.removeItem(key);
    }
    static DatetimeSubtractionString(date1) {
        var tmp = parseFloat((((new Date(date1)).getTime() - Date.now()) % (1000 * 3600 * 24)));
        var so = parseInt(((new Date(date1)).getTime() - Date.now()) / (1000 * 3600 * 24));
        return so > 0 ? tmp != 0 ? so + 1 : so : 0;
    }

    static randomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static convertFormToJSON(form) {
        const array = $(form).serializeArray(); // Encodes the set of form elements as an array of names and values.

        const json = {};
        $.each(array, function () {
            json[this.name] = this.value || "";
        });
        return json;
    }
    static decodeJwtResponse(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    static percentToHex = (p) => {
        // const percent = Math.max(0, Math.min(100, p)); // bound percent from 0 to 100
        const intValue = Math.round(p / 100 * 255); // map percent to nearest integer (0 - 255)
        const hexValue = intValue.toString(16); // get hexadecimal representation
        return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
    }

    static hexToPercent = (h) => {
        const pValue = parseInt(h, 16);
        const percent = Math.round(pValue / 255 * 100);
        return percent;
    }
    static SubStringContent = (content, index, lengthText) => {
        if (content) {
            if (content.length > lengthText) {
                return content.substring(index, lengthText) + '...'
            } else {
                return content;
            }
        }
        return '';
    }
    static hexToRGB(hex) {
        let alpha = false,
            h = hex.slice(hex.startsWith('#') ? 1 : 0);
        if (h.length === 3) h = [...h].map(x => x + x).join('');
        else if (h.length === 8) alpha = true;
        h = parseInt(h, 16);
        return (
            'rgb' +
            (alpha ? 'a' : '') +
            '(' +
            (h >>> (alpha ? 24 : 16)) +
            ', ' +
            ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
            ', ' +
            ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
            (alpha ? `, ${h & 0x000000ff} ` : '') +
            ')'
        );
    }

    static rgbToHex(rgba) {
        // Extract the rgb or rgba values from the string using regex
        const rgbMatch = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/);

        // Ensure the string is valid
        if (!rgbMatch) {
            throw new Error("Invalid RGB or RGBA format");
        }

        // Parse the extracted values
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);

        // If alpha is present, parse it, otherwise default to 1 (fully opaque)
        const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;

        // Ensure r, g, b values are between 0 and 255
        const red = Math.max(0, Math.min(255, r)).toString(16).padStart(2, '0');
        const green = Math.max(0, Math.min(255, g)).toString(16).padStart(2, '0');
        const blue = Math.max(0, Math.min(255, b)).toString(16).padStart(2, '0');

        // Convert alpha to a value between 0 and 255, then to hex
        const alpha = Math.max(0, Math.min(1, a)) * 255;
        const alphaHex = Math.round(alpha).toString(16).padStart(2, '0');

        // Combine the hex values
        return `#${red}${green}${blue}${alphaHex}`;
    }

    static colorNameToHex(color) {
        let colors = {
            "aliceblue": "f0f8ff", "antiquewhite": "faebd7", "aqua": "00ffff", "aquamarine": "7fffd4", "azure": "f0ffff",
            "beige": "f5f5dc", "bisque": "ffe4c4", "black": "000000", "blanchedalmond": "ffebcd", "blue": "0000ff", "blueviolet": "8a2be2", "brown": "a52a2a", "burlywood": "deb887",
            "cadetblue": "5f9ea0", "chartreuse": "7fff00", "chocolate": "d2691e", "coral": "ff7f50", "cornflowerblue": "6495ed", "cornsilk": "fff8dc", "crimson": "dc143c", "cyan": "00ffff",
            "darkblue": "00008b", "darkcyan": "008b8b", "darkgoldenrod": "b8860b", "darkgray": "a9a9a9", "darkgreen": "006400", "darkkhaki": "bdb76b", "darkmagenta": "8b008b", "darkolivegreen": "556b2f",
            "darkorange": "ff8c00", "darkorchid": "9932cc", "darkred": "8b0000", "darksalmon": "e9967a", "darkseagreen": "8fbc8f", "darkslateblue": "483d8b", "darkslategray": "2f4f4f", "darkturquoise": "00ced1",
            "darkviolet": "9400d3", "deeppink": "ff1493", "deepskyblue": "00bfff", "dimgray": "696969", "dodgerblue": "1e90ff",
            "firebrick": "b22222", "floralwhite": "fffaf0", "forestgreen": "228b22", "fuchsia": "ff00ff",
            "gainsboro": "dcdcdc", "ghostwhite": "f8f8ff", "gold": "ffd700", "goldenrod": "daa520", "gray": "808080", "green": "008000", "greenyellow": "adff2f",
            "honeydew": "f0fff0", "hotpink": "ff69b4",
            "indianred ": "cd5c5c", "indigo": "4b0082", "ivory": "fffff0", "khaki": "f0e68c",
            "lavender": "e6e6fa", "lavenderblush": "fff0f5", "lawngreen": "7cfc00", "lemonchiffon": "fffacd", "lightblue": "add8e6", "lightcoral": "f08080", "lightcyan": "e0ffff", "lightgoldenrodyellow": "fafad2",
            "lightgrey": "d3d3d3", "lightgreen": "90ee90", "lightpink": "ffb6c1", "lightsalmon": "ffa07a", "lightseagreen": "20b2aa", "lightskyblue": "87cefa", "lightslategray": "778899", "lightsteelblue": "b0c4de",
            "lightyellow": "ffffe0", "lime": "00ff00", "limegreen": "32cd32", "linen": "faf0e6",
            "magenta": "ff00ff", "maroon": "800000", "mediumaquamarine": "66cdaa", "mediumblue": "0000cd", "mediumorchid": "ba55d3", "mediumpurple": "9370d8", "mediumseagreen": "3cb371", "mediumslateblue": "7b68ee",
            "mediumspringgreen": "00fa9a", "mediumturquoise": "48d1cc", "mediumvioletred": "c71585", "midnightblue": "191970", "mintcream": "f5fffa", "mistyrose": "ffe4e1", "moccasin": "ffe4b5",
            "navajowhite": "ffdead", "navy": "000080",
            "oldlace": "fdf5e6", "olive": "808000", "olivedrab": "6b8e23", "orange": "ffa500", "orangered": "ff4500", "orchid": "da70d6",
            "palegoldenrod": "eee8aa", "palegreen": "98fb98", "paleturquoise": "afeeee", "palevioletred": "d87093", "papayawhip": "ffefd5", "peachpu": "ffdab9", "peru": "cd853f", "pink": "ffc0cb", "plum": "dda0dd", "powderblue": "b0e0e6", "purple": "800080",
            "rebeccapurple": "663399", "red": "ff0000", "rosybrown": "bc8f8f", "royalblue": "4169e1",
            "saddlebrown": "8b4513", "salmon": "fa8072", "sandybrown": "f4a460", "seagreen": "2e8b57", "seashell": "fff5ee", "sienna": "a0522d", "silver": "c0c0c0", "skyblue": "87ceeb", "slateblue": "6a5acd", "slategray": "708090", "snow": "fffafa", "springgreen": "00ff7f", "steelblue": "4682b4",
            "tan": "d2b48c", "teal": "008080", "thistle": "d8bfd8", "tomato": "ff6347", "turquoise": "40e0d0",
            "violet": "ee82ee",
            "wheat": "f5deb3", "white": "ffffff", "whitesmoke": "f5f5f5",
            "yellow": "ffff00", "yellowgreen": "9acd32"
        };

        return colors[color.toLowerCase()];
    }

    static prettyJsonToString(data, space) {
        return JSON.stringify(data, null, 6).replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
    }

    static handleListInput(listInput) {
        let _obj = {};
        listInput.forEach(function (item) {
            if (item?.Name != "") {
                let name = item.Name;
                _obj[name] = item.Value;
            }
        });
        return _obj;
    }

    static handleRequestUrl(request, listParam) {
        let param = "";
        listParam.forEach(function (e) {
            if (e.Name != null && e.Name != "") {
                param.concat(e.Name + "=" + e.value + "&");
            }
        });
        var requestUrl = request.Url;
        if (param != "") {
            requestUrl = requestUrl + "?" + param.slice(0, -1);
        }
        return requestUrl;
    }

    static syntaxHighlight(json) {
        json = JSON.stringify(json, null, 6);

        return json.replace(/\n( *)/g, function (match, p1) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            }
            else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<br>' + '&nbsp;'.repeat(p1.length) + '<span className="' + cls + '">' + match + '</span>';
        });
        //return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        //    var cls = 'number';
        //    if (/^"/.test(match)) {
        //        if (/:$/.test(match)) {
        //            cls = 'key';
        //        } else {
        //            cls = 'string';
        //        }
        //    } else if (/true|false/.test(match)) {
        //        cls = 'boolean';
        //    } else if (/null/.test(match)) {
        //        cls = 'null';
        //    }
        //    return '<span class="' + cls + '">' + match + '</span>';
        //});
    }

    static generateRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    static generateLightColorRgb() {
        return 'rgb(' + (Math.floor((256 - 229) * Math.random()) + 230) + ',' +
            (Math.floor((256 - 229) * Math.random()) + 230) + ',' +
            (Math.floor((256 - 229) * Math.random()) + 230) + ')';
    }

    static generateDarkColorRgb(number) {
        const red = Math.floor((number ?? Math.random()) * 256 / 2);
        const green = Math.floor((number ?? Math.random()) * 256 / 2);
        const blue = Math.floor((number ?? Math.random()) * 256 / 2);
        return "rgb(" + red + ", " + green + ", " + blue + ")";
    }

    static toSlug(input) {
        return input.toString().toLowerCase()
            .replace(/đ/g, 'd')
            .replace(/[í|ì|ỉ|ĩ|ị]/g, 'i')
            .replace(/[ý|ỳ|ỷ|ỹ|ỵ]/g, 'y')
            .replace(/[á|à|ả|ã|ạ|â|ă|ấ|ầ|ẩ|ẫ|ậ|ắ|ằ|ẳ|ẵ|ặ]/g, 'a')
            .replace(/[é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ]/g, 'e')
            .replace(/[ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự]/g, 'u')
            .replace(/[ó|ò|ỏ|õ|ọ|ô|ơ|ố|ồ|ổ|ỗ|ộ|ớ|ờ|ở|ỡ|ợ]/g, 'o')
            .replace(/\s+/g, ' ')
            .replace(/({|}|\(|\)|<|>)/g, "")
            .replaceAll(" ", "-");
    }

    static convertToKebabCase = (str) => {
        return str
            .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert hyphen between lowercase and uppercase letters
            .toLowerCase()                       // Convert entire string to lowercase
            .replace(/[ _]/g, '-');              // Replace spaces or underscores with hyphens
    };

    static removeDuplicates= (array) => {
        return array.filter((id, index, arr) => arr.indexOf(id) === index);
    }
}

Array.prototype.filterAndMap = function (callbackfn) {
    let k, len, result = [];

    // Method cannot be run on an array that does not exist.
    if (this == null) {
        throw new TypeError('this is null or not defined');
    }

    // Loop through array.
    len = this.length;
    k = 0;
    while (k < len) {
        if (k in this) {
            // For each element, if callback returns truthy, add it to
            // result array.
            if (callbackfn) {
                if (!result.includes(callbackfn.call(undefined, this[k], k, this))) {
                    result.push(callbackfn.call(undefined, this[k], k, this));
                }
            } else {
                if (!result.includes(this[k])) {
                    result.push(this[k]);
                }
            }
        }
        k = k + 1;
    }
    return result;
}

export function formatNumberConvert(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}


export function fortmatDate(date) {
    let dateFormat;
    if (date) dateFormat = format(new Date(date), "dd/MM/yyyy HH:mm");
    return dateFormat
}

export function inputMoneyPattern(ev) {
    let num = ev.target.value.replaceAll(",", "").length % 3;
    if (num > 0) {
        let newV = ev.target.value.replaceAll(",", "").substring(num).split("");
        ev.target.value = ev.target.value.replaceAll(",", "").substring(0, num) + newV.map((v, i) => i % 3 === 0 ? `, ${v} ` : v).join("");
    } else {
        let newV = ev.target.value.replaceAll(",", "").split("");
        ev.target.value = newV.map((v, i) => i > 0 && i % 3 === 0 ? `, ${v} ` : v).join("");
    }
}

export const randomGID = () => crypto.randomUUID().replaceAll("-", "")

export const checkTimeChartType = (type) => _groupByTimeChart.includes(type)

export const fileFormat = (url) => {
    const fileExt = url.split(".").pop();

    if(fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg") return "video";
    if(fileExt === "mp3" || fileExt === "wav")  return "audio";
    if(fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg" || fileExt === "gif")  return "image";
    return "file";
}

export const transformUrl = (url = "", width = 100) => url;

// export function replaceEmojis(text) {
//     const regex = new RegExp(
//         `(${Object.keys(emojiMap)
//             .map((key) => key.replace(/([.*+?^${}()|[\]\\])/g, "\\$1"))
//             .join("|")})`,
//         "g"
//     );
    
//     const parts = text.split(regex);

//     return parts.map((part, index) =>
//         emojiMap[part] ? (
//             <Winicon key={index} src={emojiMap[part]} size={ "4rem"} />
//         ) : (
//             <span key={index}>{part}</span>
//         )
//     );
// };