
function Program(programdata,element_id,channel){
	this.init(programdata,channel);	
}

Program.prototype.init = function(programdata,channel){
	for(var field in programdata){
		this[field] = programdata[field];
	}
    this.channel = channel;
}

Program.prototype.populate = function(){
	var self = this;

	if(self.element == null){
		var element = document.createElement("a");
		element.addClass("list-group-item list-group-item-action row d-flex px-2 py-1");
		element.setAttribute("href", "#");
        element.addEventListener("click", function () { openProgramInfo(self); }, false);
        var now = new Date();
        if(self.start < now) {
            if(self.end < now) {
                element.addClass("past");
            }
            else {
                element.addClass("current");
            }
        }
		var startTime = document.createElement("div");
        startTime.addClass("col-4 col-md-2 col-xl-1 pl-0");
        startTime.innerHTML = self.start.create24HourTimeString();
        element.appendChild(startTime);
        var title = document.createElement("div");
        title.addClass("col-6 col-md-8 col-xl-10 px-0 text-truncate");
        title.innerHTML = self.getTitle();
        if(self.parentalRating && self.parentalRating.length > 0) {
            for(var i = 0;i < self.parentalRating.length;i++) {
                if(self.parentalRating[i].minimumage) {
                     title.innerHTML += "("+self.parentalRating[i].minimumage+")";
                    break;
                }
            }
        }
        element.appendChild(title);
        if(self.cpsIndex) {
          var cpsInstance = self.channel.getServiceInstanceByCPSIndex(self.cpsIndex);
          if(cpsInstance) {
             $(element).append($('<div class="chdrm col-2 col-md-2 col-xl-1 px-0 d-block text-right"><img src="images/lock.svg" class="icon-green"></div>'));
          }
          else {
            $(element).append($('<div class="chdrm col-2 col-md-2 col-xl-1 px-0 d-block text-right"><img src="images/lock.svg" class="icon-red"></div>'));
          }
        }
		self.element = element;
	}
  return self.element;
}

Program.prototype.populateProgramInfo = function(){
    $("#info_chicon").attr('src',this.channel.image || "./images/empty.png");
    $("#info_chnumber").text(this.channel.lcn);
    $(".chdrm").remove();
    if(this.cpsIndex) {
      var cpsInstance = this.channel.getServiceInstanceByCPSIndex(this.cpsIndex);
      if(cpsInstance) {
         $('<span class="chdrm"><img src="images/lock.svg" class="icon-green mt-2"></span>').insertAfter("#info_chname");
      }
      else {
        $('<span class="chdrm"><img src="images/lock.svg" class="icon-red mt-2"></span>').insertAfter("#info_chname");
      }
    }
    $("#info_chname").text( getLocalizedText(this.channel.titles, language_settings.ui_language));
    $(".title").text(this.getTitle());
    $(".description").html( this.getDescription());
    $(".img").attr('src',this.mediaimage);
    $(".date").text(this.start.getDate()+"."+(this.start.getMonth()+1)+".");
    $(".starttime").text(this.start.create24HourTimeString());
    $(".endtime").text(this.end.create24HourTimeString());
    $(".duration").text(this.prglen+" mins");
    if(this.parentalRating && this.parentalRating.length > 0) {

        var parental = [];
        for(var i = 0;i < this.parentalRating.length;i++) {
            if(this.parentalRating[i].minimumage) {
                parental.push("MinimumAge:"+this.parentalRating[i].minimumage);
            }
            if(this.parentalRating[i].parentalRating) {
                parental.push("Rating:"+getParentalRating(this.parentalRating[i].parentalRating));
            }
            if(this.parentalRating[i].explanatoryText) {
                parental.push("Reason:"+this.parentalRating[i].explanatoryText);
            }
        }
        $(".parentalrating").text(parental.join(" "));
    }
    $("#select_service_button").attr("href","javascript:channelSelected('"+this.channel.id+"')");
}

Program.prototype.getTitle = function() {
  if(this.titles.length == 1) {
    return this.titles[0].text;
  }
  else if(this.titles.length > 1){
    var defaultTitle = null;
    for(var i = 0;i < this.titles.length;i++) {
      if(this.titles[i].type == "main" && this.titles[i].lang == language_settings.ui_language) {
        return this.titles[i].text;
      }
      else if(this.titles[i].type == "main" && this.titles[i].lang == "default") {
        defaultTitle = this.titles[i].text;
      }
    }
    if(defaultTitle != null) {
      return defaultTitle;
    }
    else {
      return this.titles[0].text
    }
  }
  return "";
}

Program.prototype.getDescription = function() {
    
  if(this.descriptions.length == 1) {
    return this.descriptions[0].text;
  }
  else if(this.descriptions.length > 1){
    var defaultDesc = null;
    for(var i = 0;i < this.descriptions.length;i++) {
      if(this.descriptions[i].lang == language_settings.ui_language) {
        return this.descriptions[i].text;
      }
      else if(this.descriptions[i].lang == "default") {
        defaultDesc = this.descriptions[i].text;
      }
    }
    if(defaultDesc != null) {
      return defaultDesc;
    }
    else {
      return this.descriptions[0].text
    }
  }
  return "No description";
}
