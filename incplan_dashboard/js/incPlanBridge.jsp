<%@ include file="/util/FePageHeader.jspf"%>
<%
layout.addCSSFile(reqEnv.getCSSPathWithVersion("/_new/userweb/common/incomeplan/incomeplanner-shared.css"));
layout.addCSSFile(reqEnv.getCSSPathWithVersion("/_new/userweb/common/incomeplan/incomeplanner.css"));
%>
<%@ include file="/util/FeLayoutTop.jspf"%>

<style type="text/css">
#ctn-left-panel {
  min-height: 580px;
}
</style>


<s:component template="fe-trailpost.ftl" id="trailpost" cssClass="visible-screen-only">
  <s:param name="dataSource" value="'trailpost'" />
</s:component>
<div class="panel-divider"></div>


<s:component template="fe-main-page.ftl">
  <s:param name="body">
  
    <s:form method="post" id="incomeBridgeForm">
    
      <div id="otherIncomeContainer" class="fe-panel-rcs">
    
        <div id="left-vs-right" class="grid-row">
    
          <%-- -------------------------------------------------------------------------- --%>
          <%-- Left panel                                                                 --%>
          <%-- -------------------------------------------------------------------------- --%>
          
          <div id="ctn-left-panel" class="grid-4">
            <div id="ctn-income"></div>
            <div>
              <a id="lnk-add-income-type" href='javascript:void(0)' class="fe-button fe-button-blue"><s:property value="%{getText('addAccountButton')}" /></a>
              <div id="chevron-down"></div>
            </div>
          </div>
          
          <%-- -------------------------------------------------------------------------- --%>
          <%-- Right panel                                                                --%>
          <%-- -------------------------------------------------------------------------- --%>
          
          <div id="ctn-right-panel" class="grid-8">
            <s:hidden id="hdf-bar-index" key="selectedBarIndex" value="%{selectedYearlyIncomeIndex}" />
            
            <div id="show-hide-goal">
              <a id="show-goal" href="javascript:void(0);" style="display: none;"><s:text name="showGoal" /></a>
              <a id="hide-goal" href="javascript:void(0);" style="display: none;"><s:text name="hideGoal" /></a>
            </div>
            
            <div id="barchart-incomeplan" class="incomeplan-barchart"></div>
    
            <div id="savings-forecast-container">
              <div id="forecast-piggybank" class="piggybank"></div>
              <div id ="forecast-age">
                <s:text name="ageForecast">
                  <s:param><s:property value="retirementAge" /></s:param>
                </s:text>
              </div>
                  <div id ="forecast-lbl">
                    <s:text name="forecast.lbl"/>
                  </div>
            </div>
    
            <div id="boost-income-container">
              <s:hidden id="hdf-slidex-index" key="selectedBridgePercent" value="%{defaultReservePercent}" />
              <div>
                <div><s:text name="boostIncomeBtnLabel" /></div>
                <div id="reserve-amount"></div>
              </div>
              <div id="reserve-slider" class="small-slider"></div>
              <div>
                <span><s:text name="savingsRemaining" /></span>
                <span id="remaining-amount"></span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <div class="panel-divider"></div>
      
      <div class="grid-row">
        <s:submit id="btn-save" action="incplanbridge-save" cssClass="fe-button fe-button-right fe-button-blue float-right" value="%{getText('next')}" theme="simple" />
        <s:submit id="btn-cancel" action="incplanbridge-cancel" cssClass="fe-button fe-button-left fe-button-olive float-left" value="%{getText('back')}" theme="simple" />
      </div>
    </s:form>
    <%@ include file="incPlanDisclosureLink.jspf"%>
  </s:param>
</s:component>


<script type="text/javascript">
FE.page.barChartRendered = false;

Y.use('fe-list-view', 'fe-stacked-barchart', 'fe-piggybank', 'json', 'fe-popup-menu', function(Y) {
  
  var incomePlanSources, 
    nIncomePlanIndex, 
    nSliderIndex,
    reserveAmounts, 
    remainingAmounts, 
    bShowGoal = false;

  
  incomePlanSources = Y.JSON.parse('<s:property value="%{toJsonString(incomePlanSourcesConfigurations)}" escape="false" />');
  nSliderIndex = <s:property value="defaultReservePercent" />;
  nIncomePlanIndex = <s:property value="selectedYearlyIncomeIndex" />;
  reserveAmounts = Y.JSON.parse('<s:property value="%{toJsonString(reserveAmounts)}" escape="false" />');
  remainingAmounts = Y.JSON.parse('<s:property value="%{toJsonString(remainingAmounts)}" escape="false" />');
  
  //
  // List view
  //
  
  var listView, 
    listViewConfig, 
    savingsConfig,
    jsonLumpsumConfig;
  
  listViewConfig = incomePlanSources[nSliderIndex][nIncomePlanIndex];
  savingsConfig = Y.JSON.parse('<s:property value="%{toJsonString(incomePlanSavingsConfig)}" escape="false" />');
  jsonLumpsumConfig = Y.JSON.parse('<s:property value= "%{toJsonString(lumpSumViewListConfigurations)}" escape ="false"/>');
  
  listView= new Y.FE.ListView({ 'srcNode': '#ctn-income' });
  listView.render();
  listView.createOrUpdateGroup('income', listViewConfig);
  if(jsonLumpsumConfig != null)
  {
    listView.createOrUpdateGroup('lumpsum', jsonLumpsumConfig);
  }
  listView.createOrUpdateGroup('savings', savingsConfig);
  
  
  //
  // Bar chart
  //
  
  var barChart, 
    barChartConfig, 
    ndIncomePlanBarChart = Y.one('#barchart-incomeplan'), 
    ndBarIndex = Y.one('#hdf-bar-index'), 
    ndShowGoal = Y.one('#show-goal'),
    ndHideGoal = Y.one('#hide-goal'); 
  
  barChartConfig = Y.JSON.parse('<s:property value="%{toJsonString(barChartConfig)}" escape="false" />'); 
  barChart = new Y.FE.StackedBarChart('barchart-incomeplan', 550, 300, barChartConfig[nSliderIndex]);
  
  function onRendered(e) {
    FE.log('Bar chart is successfully rendered');
    FE.page.barChartRendered = true;
    
    if (bShowGoal) {
      showGoalLine();
    }
    else {
      hideGoalLine();
    }
  }

  barChart.on("rendered", onRendered);
  
  barChart.render();  
  barChart.showBubble(nIncomePlanIndex);
  

  function onBarClick(e) {
    nIncomePlanIndex = e.barIndex;
    ndBarIndex.setAttribute('value', nIncomePlanIndex);
    listView.createOrUpdateGroup('income', incomePlanSources[nSliderIndex][nIncomePlanIndex]);
  }
  
  barChart.on('barClick', onBarClick);
  
  function showGoalLine() {
    barChart.showHorizontalLine(0); 
    ndShowGoal.hide();
    ndHideGoal.show();
    bShowGoal = true;
  }
  
  function hideGoalLine() {
    barChart.hideHorizontalLine(0); 
    ndHideGoal.hide(); 
    ndShowGoal.show();
    bShowGoal = false;
  }
  
  ndShowGoal.on('click', showGoalLine);
  ndHideGoal.on('click', hideGoalLine);
  
  
  //
  // Slider
  //
  
  var reserveSlider, 
    reserveSliderConfig, 
    ndSliderIndex = Y.one('#hdf-slidex-index'), 
    ndReserveAmount = Y.one('#reserve-amount'), 
    ndRemainingAmount = Y.one('#remaining-amount'); 
  
  reserveSlider = FE.createSlider('reserve-slider', { width: 380, height: 90 });
  reserveSliderConfig = Y.JSON.parse('<s:property value="%{toJsonString(reserveSliderConfig)}" escape="false" />');
  
  function onSliderRelease(val) {
    FE.log(val + '% = ' + reserveAmounts[val]);
    
    nSliderIndex = val;
    
    ndSliderIndex.setAttribute('value', val);
    
    ndReserveAmount.setContent(reserveAmounts[nSliderIndex]);
    ndRemainingAmount.setContent(remainingAmounts[nSliderIndex]);
    listView.createOrUpdateGroup('income', incomePlanSources[nSliderIndex][nIncomePlanIndex]);
    
    FE.page.barChartRendered = false;
    ndIncomePlanBarChart.empty();
    barChart = new Y.FE.StackedBarChart("barchart-incomeplan", 550, 300, barChartConfig[nSliderIndex]);
    barChart.on('rendered', onRendered);
    barChart.on('barClick', onBarClick);
    barChart.render();
    barChart.showBubble(nIncomePlanIndex);  
  }
  
  reserveSlider.onRelease = onSliderRelease;
  reserveSlider.configure(reserveSliderConfig);
  
  onSliderRelease(nSliderIndex);
  
  
  //
  // Piggy Bank
  //
  
  var piggybank = new Y.FE.PiggyBank('forecast-piggybank', 200, 170, {
      bubble: {
        labels: [
            { 
              text: '<s:property value="%{totalPortfolioValueForReserve.toString(true, false, false, false)}"/>', 
              color: '#5AAD41'
            }, 
            {
              text: '<s:text name="whenYouRetire" />' 
            }
        ],
        borderColor: '#5AAD41'
      }, 
      image: '<s:url value="%{piggyBankImage}" />'
    });
  piggybank.render();
  
  
  //
  // Add Income Type
  //
  
  var anchorId = 'lnk-add-income-type', 
    ndAnchor = Y.one('#' + anchorId), 
    popupId = 'popupmenu-' + anchorId, 
    popup, 
    ALIGN = Y.WidgetPositionAlign;

  popup = new Y.FE.PopupMenu({
    
    align: { node: ndAnchor, points: [ALIGN.TL, ALIGN.BL] }
    , id: 'mnu-add-income-type'
    , srcNode: '#' + popupId
    , items: [
      null
      <s:iterator value="%{addIncomeList}" status="stat">                   
        , {
          label: '<s:property value="%{key}" />' 
          , action: function(e) {
            e.preventDefault();
            FE.openDialog({
              width: "610px"
              , height: "550px"
              , title: '<s:text name="addAccountButton" />'
              , href: '<s:property value="%{getUrl(getNamespace() + value, 'closedialogbox', 'dialog')}" escape="false" />' 
              , onSave: FE.reloadWindow
            });
          }
        }
      </s:iterator>
    ],
    render: true
  });

  ndAnchor.on('hover', Y.bind(popup.show, popup), Y.bind(popup.hide, popup));
});
</script>

<%@ include file="/util/FeLayoutBot.jspf"%>
