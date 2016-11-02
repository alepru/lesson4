(function(angular) {

    'use strict';

    angular
        .module('todoApp')
        .controller('TodoController', TodoController);

    TodoController.$inject = ['storageService','$mdDialog'];


    function TodoController(storageService, $mdDialog) {

        var vm = this;
        //var
        vm.selectedItem = {selected: [],currentTab: [[],[],[]]} 
        vm.currentTab = 0;
        vm.items = storageService.get() || [];
        vm.priority = null;
        vm.date = null;
        vm.title = "ciao";
        vm.noteText= null;
        vm.taskTime = null;
        vm.type = null; 
        vm.tag = null;
        vm.originatorEv= null;
        vm.isSearchShow= null;
        vm.searchInput = null;
        vm.searchIconColor = 'white';
        vm.selectAllColor = 'white';
        vm.sortBy = 0; //0 sort by alpha, 1 sort by date //
        vm.searchIn = 0; // 0 search in all , 1 search in title //
        vm.customTemplate = ["app/components/customList.template.html",      //template delle due viste implementate (list e grid)
                            "app/components/customGrid.template.html"];
        vm.viewType  = 0; // 0 list view , 1 grid view //      
       

        //function
        vm.notDone = notDone;
        vm.done = done;
        vm.all = all;
        vm.deleteItem = deleteItem;
        vm.createItem = createItem;
        vm.editItem = editItem;
        vm.addTask = addTask;
        vm.cancel = cancel;
        vm.confirm = confirm;
        vm.defaultItem = defaultItem;
        vm.consoleNg = consoleNg;
        vm.openMenu = openMenu;
        vm.searchShow= searchShow;
        vm.cleanSelectedItem = cleanSelectedItem;
        vm.selectAll = selectAll;
        vm.iconColor = iconColor;
        vm.toggleIcon = toggleIcon;


  //change the value of the icon passed as parameter //

        function toggleIcon(toggleIcon){
            switch (toggleIcon) {
                case "sortBy":
                    if(vm.sortBy == 1) vm.sortBy = 0;
                    else vm.sortBy++;
                    break;
                case "searchIn":
                    if(vm.searchIn == 1) vm.searchIn = 0;
                    else vm.searchIn++;
                    break;
                case "viewType":
                    if(vm.viewType == 1) vm.viewType = 0;
                    else vm.viewType++;
                    break;    
                default:
                    break;
            }
        }

       //metodo per il settaggio dell'icona select all//
        function iconColor(string){
            switch (string) {
                case 'select_all' :
                      if((vm.selectedItem.selected.length == vm.selectedItem.currentTab[vm.currentTab].length) & vm.selectedItem.selected.length !=0)
                         return '#00E676';
                     else 
                        return 'white';
                default:
                    break;
            }
        }

        function selectAll(){
            if(vm.selectedItem.selected.length == vm.selectedItem.currentTab[vm.currentTab].length)
               vm.selectedItem.selected = [];    
            else 
            vm.selectedItem.selected = vm.selectedItem.currentTab[vm.currentTab];
        }

       /* deselziona tutti gli elementi si un tab */
        function cleanSelectedItem(currentTab){
            vm.selectedItem.selected = [];
            vm.currentTab = currentTab;
            vm.selectAllColor = false;

        }

       /*gestisce visualizzazione barra di ricerca e colore icona*/
        function searchShow(){
            vm.isSearchShow = !vm.isSearchShow;
            if(vm.isSearchShow){
               vm.searchIconColor= '#00E676';
            }else{
                vm.searchInput= null;
               vm.searchIconColor= 'white';
            }
        }
        
        /*funzione apertura menu attualmente non utilizzata*/
        function openMenu($mdOpenMenu, ev) {
            vm.originatorEv = ev;
            $mdOpenMenu(ev);
        };
        
        //per debug ng-click//
        function consoleNg(obj){ 
              console.log(obj);
          }

       //return a empty item //
        function defaultItem(){
              var obj=   {
                 priority: 0,
                 date: new Date(),
                title: "Item"+ (vm.items.length+1),
                noteText: null,
                taskTime: null,
                 type: "simple",
                 dateForSort: ""
             }
             return obj;
        }

        
     // filter function //
        function notDone(item) {
            return item.done == false;
        }

        function done(item) {
            return item.done == true;
        }

        function all(item) {
            return true;
        }


        function editItem(obj){
            var index = vm.items.indexOf(vm.selectedItem.selected[0]);
                    if (index != -1) {
                           obj.dateForSort = obj.date.getTime();
                           vm.items[index]= obj;  
                        }
            vm.selectedItem.selected[0] = obj;             
            storageService.set(vm.items);
        }

        //Delete the current selected item, if any
        function deleteItem(ev) {
        
            if (vm.selectedItem.selected != null) {
                var string= "";
                for(var i=0;i<vm.selectedItem.selected.length;i++){
                    string += vm.selectedItem.selected[i].title + ","
                }
                var confirm = $mdDialog.confirm()
                   
                .textContent('The task: "' + string + '" will be deleted. Are you sure?')
                    .ariaLabel('Delete task')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        for(var i=0;i<vm.selectedItem.selected.length;i++){
                        var index = vm.items.indexOf(vm.selectedItem.selected[i]);
                        if (index != -1) {
                            vm.items.splice(index, 1);   
                            }
                        }
                    storageService.set(vm.items);
                        vm.selectedItem.selected = [];
                    }
                });
            }
        }

        //Creates a new item with the given parameters
        function createItem(obj) {
             
            vm.items.push({
                title: obj.title,
                done: obj.done || false,
                priority: obj.priority || 0,
                date: obj.date || new Date(),
                noteText: obj.noteText,
                taskTimeForm: obj.taskTime,
                 type: obj.type,
                dateForSort: obj.date.getTime(),
                })
            
         storageService.set(vm.items);
            
        }

        //Add or modify task to the items list
        function addTask(ev,isAdd,obj) {
          var obj1 = angular.copy(obj);
            //custom form//
            var myFormDialog = {
                locals: {item: obj1,formType: isAdd},
                bindToController: true,
                controller: 'TodoController',
                 controllerAs: 'ctrl',
                 templateUrl: 'app/components/addForm.tmpl.html',
                 parent: angular.element(document.body),
                 targetEvent: ev,
                 clickOutsideToClose:false
    }    
            if (isAdd){
            $mdDialog.show(myFormDialog).then(function(result) {
                 vm.createItem(result);
            });
            }else{
                $mdDialog.show(myFormDialog).then(function(result) {                    
                 vm.editItem(result);
                 });
            }
        };

     function cancel() {
      $mdDialog.cancel();
    };
     
     function confirm(obj){
         $mdDialog.hide(obj);
     }
    }
  
})(window.angular);