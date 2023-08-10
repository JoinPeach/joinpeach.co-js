/*

Instructions: https://github.com/NoCodeQuest/webflow-10k-limit-bypassed

CDN 1: https://www.jsdelivr.com/github
CDN 2: https://raw.githack.com/

Public file: https://raw.githubusercontent.com/mskalra/joinpeach.co-js/main/home_page.js

Use CDN 2 and then update webflow script:
<script type="text/javascript" src="<ADD_CDN_LINK_HERE>"></script>

*/

function inView(elem){
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function addClass(elName, className) {
	el = getQ(elName)
	if (el.getAttribute("class").indexOf(className) == -1) {
  	el.classList.add(className)
  }
}

function removeClass(elName, className) {
	el = getQ(elName)
	if (el.getAttribute("class").indexOf(className) != -1) {
  	el.classList.remove(className)
  }
}

window.addEventListener('scroll',e=>{
	document.querySelectorAll('.s-item-header1 , .s-item-header2 , .s-item-header3').forEach(el=>{
  	if(el.getAttribute("class").indexOf('s-item-header1') != -1 && inView(el)) {
		  addClass('.image-1', 'aa');
      removeClass('.image-1', 'bb');
		  addClass('.image-2', 'bb');
    	removeClass('.image-2', 'aa');
		  addClass('.image-3', 'bb');
    	removeClass('.image-3', 'aa');
    }
  	if(el.getAttribute("class").indexOf('s-item-header2') !== -1 && inView(el)) {
		  addClass('.image-1', 'bb');
    	removeClass('.image-1', 'aa');
		  addClass('.image-2', 'aa');
    	removeClass('.image-2', 'bb');
		  addClass('.image-3', 'bb');
    	removeClass('.image-3', 'aa');
    }
  	if(el.getAttribute("class").indexOf('s-item-header3') !== -1 && inView(el)) {
		  addClass('.image-1', 'bb');
    	removeClass('.image-1', 'aa');
		  addClass('.image-2', 'bb');
    	removeClass('.image-2', 'aa');
		  addClass('.image-3', 'aa');
    	removeClass('.image-3', 'bb');
	}
  })
})

function getQ(name) {
  return document.querySelector(name);
}

function getE(name) {
  return document.getElementById(name);
}

//Variables
const outstandingAmountSlider = getE("amount-slider");
const monthlyAmountSlider = getE("monthly-slider");
const outstandingAmountValue = getE("amount-value");
const monthlyAmountValue = getE("monthly-value");
const totalSaved = getE("total-saved");
const timeSaved = getE("time-saved");
const totalPaymentWithoutPeach = getE("total-payment-without-peach");;
const totalPaymentWithPeach = getE("total-payment-with-peach");
const columnWithoutPeach = getQ('.dashboard-item');
const columnWithPeach = getQ('.dashboard-item-2')
let loanType = 'credit'

let interestRate = 20.77;
let loanTerm = 36;
const additionalPayment = 40;
const thumbOffset = 1.5;

function NPER(rate, payment, present, future, type) {
  // Initialize type
  type = typeof type === 'undefined' ? 0 : type;
  payment = -payment;
  // Initialize future value
  future = typeof future === 'undefined' ? 0 : future;
  // Return number of periods
  const num = payment * (1 + rate * type) - future * rate;
  const den = present * rate + payment * (1 + rate * type);
  return Math.log(num / den) / Math.log(1 + rate);
}

const numberFormat = Intl.NumberFormat("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

//Calculations handler
outstandingAmountSlider.addEventListener("input", (e) => {
  outstandingAmountValue.innerHTML = e.target.value;
  monthlyAmountSlider.setAttribute("max", e.target.value / 30);
  monthlyAmountSlider.setAttribute(
    "min",
    Math.round(e.target.value * (interestRate / 100 / 12)) + 1
  );
  monthlyAmountValue.innerHTML = monthlyAmountSlider.value;
  setCalcData(loanType);
  setSliderBackgroundSize(e.target, true);
});

monthlyAmountSlider.addEventListener("input", (e) => {
  monthlyAmountValue.innerHTML = e.target.value;
  setCalcData(loanType);
  setSliderBackgroundSize(e.target);
});

const calcStudentLoan = (amount, apr, monthly, additional) => {
  amount = parseFloat(amount);
  apr = apr / 100;
  monthly = parseFloat(monthly);
  const timeTillPayOffWithoutPeach = -(
    Math.log10(1 - (amount * (apr / 12)) / monthly) /
    Math.log10(1 + apr / 12)
  );
  const totalPaymentWithoutPeach = timeTillPayOffWithoutPeach * monthly;
  const totalInterestPaidWithoutPeach =
    monthly * timeTillPayOffWithoutPeach - amount;
  const timeTillPayOffWithPeach = -(
    Math.log10(1 - (amount * (apr / 12)) / (monthly + additional)) /
    Math.log10(1 + apr / 12)
  );
  const totalPaymentWithPeach =
    timeTillPayOffWithPeach * (monthly + additional);
  const totalInterestPaidWithPeach =
    (monthly + additional) * timeTillPayOffWithPeach - amount;
  const totalInterestSavedWithPeach =
    totalInterestPaidWithoutPeach - totalInterestPaidWithPeach;
  const totalTimeSaved = timeTillPayOffWithoutPeach - timeTillPayOffWithPeach;
  return {
    totalTimeSaved: totalTimeSaved.toFixed(0),
    totalPaymentWithoutPeach: totalPaymentWithoutPeach.toFixed(0),
    totalPaymentWithPeach: totalPaymentWithPeach.toFixed(0),
    totalInterestSavedWithPeach: totalInterestSavedWithPeach.toFixed(0)
  };
};

const calcCredit = (amount, apr, monthly, additional) => {
  amount = parseFloat(amount);
  apr = apr / 100 / 12;
  monthly = parseFloat(monthly);
  const timeTillPayOffWithoutPeach = NPER(apr, monthly, amount);
  const totalPaymentWithoutPeach = timeTillPayOffWithoutPeach * monthly;
  const totalInterestPaidWithoutPeach =
    monthly * timeTillPayOffWithoutPeach - amount;
  const timeTillPayOffWithPeach = NPER(apr, monthly + additional, amount);
  const totalPaymentWithPeach =
    timeTillPayOffWithPeach * (monthly + additional);
  const totalInterestPaidWithPeach =
    (monthly + additional) * timeTillPayOffWithPeach - amount;
  const totalInterestSavedWithPeach =
    totalInterestPaidWithoutPeach - totalInterestPaidWithPeach;
  const totalTimeSaved = timeTillPayOffWithoutPeach - timeTillPayOffWithPeach;
  return {
    totalTimeSaved: totalTimeSaved.toFixed(0),
    totalPaymentWithoutPeach: totalPaymentWithoutPeach.toFixed(0),
    totalPaymentWithPeach: totalPaymentWithPeach.toFixed(0),
    totalInterestSavedWithPeach: totalInterestSavedWithPeach.toFixed(0)
  };
};

const calcOthers = (amount, apr, loanTerm, additional) => {
  amount = parseFloat(amount);
  apr = apr / 100 / 12;
  const monthly = (apr / (1 - Math.pow(1 + apr, -loanTerm))) * amount;
  const timeTillPayOffWithoutPeach = -(
    Math.log10(1 - (amount * (apr)) / (monthly)) /
    Math.log10(1 + apr)
  );

  const totalPaymentWithoutPeach = timeTillPayOffWithoutPeach * monthly;
  const totalInterestPaidWithoutPeach =
    monthly * timeTillPayOffWithoutPeach - amount;
  const timeTillPayOffWithPeach = -(
    Math.log10(1 - (amount * (apr)) / (monthly + additional)) /
    Math.log10(1 + apr)
  );
  const totalPaymentWithPeach =
    timeTillPayOffWithPeach * (monthly + additional);
  const totalInterestPaidWithPeach =
    (monthly + additional) * timeTillPayOffWithPeach - amount;
  const totalInterestSavedWithPeach =
    totalInterestPaidWithoutPeach - totalInterestPaidWithPeach;
  const totalTimeSaved = timeTillPayOffWithoutPeach - timeTillPayOffWithPeach;
  return {
    totalTimeSaved: totalTimeSaved.toFixed(0),
    totalPaymentWithoutPeach: totalPaymentWithoutPeach.toFixed(0),
    totalPaymentWithPeach: totalPaymentWithPeach.toFixed(0),
    totalInterestSavedWithPeach: totalInterestSavedWithPeach.toFixed(0)
  };
};

const setCalcData = (type = "credit") => {
	let calculated;
  if (type === "student") {
      calculated = calcStudentLoan(
      outstandingAmountSlider.value,
      interestRate,
      monthlyAmountSlider.value,
      additionalPayment
    );
  } else if (type === "credit") {
      calculated = calcCredit(
      outstandingAmountSlider.value,
      interestRate,
      monthlyAmountSlider.value,
      additionalPayment
    );
  } else {
      calculated = calcOthers(
      outstandingAmountSlider.value,
      interestRate,
      loanTerm,
      additionalPayment
    );
  }
  timeSaved.innerHTML = calculated.totalTimeSaved + ' ' + 'months';
  totalSaved.innerHTML = '$' + numberFormat.format(calculated.totalInterestSavedWithPeach) + ' ';
  totalPaymentWithoutPeach.innerHTML = '$' + numberFormat.format(calculated.totalPaymentWithoutPeach);
  totalPaymentWithPeach.innerHTML = '$' + numberFormat.format(calculated.totalPaymentWithPeach);
  const barsDifferene = calculated.totalPaymentWithPeach / calculated.totalPaymentWithoutPeach
  const columnWithoutPeachHeight = columnWithoutPeach.offsetHeight;
  columnWithPeach.style.height = columnWithoutPeachHeight * barsDifferene + 'px';
}

const setSliderBackgroundSize = (target, withSecondUpdate = false) => {
	const min = target.min;
  const max = target.max;
  const val = target.value;
  const backgroundSize = ((val - min) * 100) / (max - min);
  const backgroundSizeWithOffset =
    backgroundSize <= 50 ? backgroundSize === 0 ? 0 : backgroundSize + thumbOffset : backgroundSize - thumbOffset;
  target.style.backgroundSize =
    backgroundSizeWithOffset + "% 100%";
  if (withSecondUpdate) {
  const secondMin = monthlyAmountSlider.min;
  const secondMax = monthlyAmountSlider.max;
  const secondVal = monthlyAmountSlider.value;
  const secondBackgroundSize =
    ((secondVal - secondMin) * 100) / (secondMax - secondMin);
  const secondBackgroundSizeWithOffset =
    secondBackgroundSize <= 50
      ? secondBackgroundSize === 0 ? 0 : secondBackgroundSize + 1.5
      : secondBackgroundSize - 1.5;
  monthlyAmountSlider.style.backgroundSize =
    secondBackgroundSizeWithOffset + "% 100%";
  }
}

const setSliderDefaults = (target, withSecondUpdate = false) => {
  outstandingAmountSlider.setAttribute(
    "value",
    15000
  );
	setSliderBackgroundSize(outstandingAmountSlider, true);
}

// TODO(mahir): Clean this up once its working.
const setReferralSource = () => {
  var queryString = window.location.search;
  // ?utm_source=facebook&utm_medium=post&utm_campaign=webflow
  var URLSearchParams_wb = new URLSearchParams(queryString);

  const utmParameters = [
    "referral_source",
    // "utm_medium",
    // "utm_campaign"
  ];

  for (const utm_element of utmParameters) {
    document.getElementById(utm_element).value = URLSearchParams_wb.get(utm_element)
    /* if utm_source exist */
    // $( "form" ).each(function( index ) {
    //   if(URLSearchParams_wb.has(utm_element)){
    //     console.log(utm_element + "is exist");
    //     /* get UTM value of this utm param */

    //     /* change form hidden feild to this utm url value */
    //     $( this ).find("."+utm_element).val(value);
    //   }

    // })
  }/* end for loop */

}

window.addEventListener('load', (event) => {
  setCalcData();
  setSliderDefaults();
  setReferralSource();
});
