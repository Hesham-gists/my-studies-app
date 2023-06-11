### `ngOnChanges()`

Suppose we have a parent component that fetches a list of users from an API and passes it to a child component called `UserListComponent`. The child component displays the list of users.

The problem is that whenever the parent component receives a new list of users, it passes the updated array to the child component, triggering a re-rendering of the entire `UserListComponent`. This behavior can be inefficient, especially if the user list is large, leading to unnecessary updates and potential performance degradation.

Solution using `ngOnChanges()`: To optimize performance, we can leverage the `ngOnChanges()` lifecycle hook and the `SimpleChanges` object to detect changes in the input array and update the child component only when necessary.

Here's an example implementation:

```ts
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-user-list",
  template: `
    <div>
      <h2>User List</h2>
      <ul>
        <li *ngFor="let user of users">{{ user.name }}</li>
      </ul>
    </div>
  `,
})
export class UserListComponent implements OnChanges {
  @Input() users: User[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.users && !changes.users.firstChange) {
      // User list has changed
      console.log("User list has changed:", changes.users.currentValue);
      this.updateUserList(changes.users.currentValue);
    }
  }

  private updateUserList(updatedUsers: User[]) {
    // Perform the necessary logic to update the user list in the component
    // Example: Re-assign the updated array to the component property
    this.users = updatedUsers;
  }
}
```

In this example, the `UserListComponent` receives the `users` array as an input property. Inside the `ngOnChanges()` method, we check if the `users` property has changed using `changes.users`. We also ensure that it is not the initial change by checking `!changes.users.firstChange`.

If there is a change in the `users` array, we log a message and call the `updateUserList()` method, passing the current value of `users`. The `updateUserList()` method can perform the necessary logic to update the user list in the component. In this example, we simply reassign the updated array to the component's `users` property.

By using `ngOnChanges()` and the `SimpleChanges` object, we can detect changes in the input array and update the child component only when there are actual changes. This optimization prevents unnecessary re-renders and improves performance, especially when dealing with large data sets.

Additionally, you can further optimize the performance by using trackBy function in the `*ngFor` directive within the template. The trackBy function helps Angular track the identity of the list items, reducing the amount of DOM manipulation required during updates.

```html
<ul>
  <li *ngFor="let user of users; trackBy: trackByFn">{{ user.name }}</li>
</ul>
```

```ts
trackByFn(index: number, user: User) {
return user.id; // Assuming each user has a unique identifier property like 'id'
}
```

By implementing the trackBy function, Angular can efficiently determine which items have changed and update only the necessary elements in the DOM, further enhancing the performance of the `UserListComponent`.

---

### `ngOnInit()`

Suppose we have a component called `UserListComponent` that fetches a list of users from an API and needs to initialize some data or perform additional setup tasks when the component is created.

Solution using `ngOnInit()`: To solve this problem, we can utilize the `ngOnInit()` lifecycle hook, which is called once when the component is initialized. This is the ideal place to perform component initialization tasks.

Here's an example implementation:

```ts
import { Component, OnInit } from "@angular/core";
import { UserService } from "./user.service";

@Component({
  selector: "app-user-list",
  template: `
    <div>
      <h2>User List</h2>
      <ul>
        <li *ngFor="let user of users">{{ user.name }}</li>
      </ul>
    </div>
  `,
})
export class UserListComponent implements OnInit {
  users: User[];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  private fetchUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      // Additional initialization tasks can be performed here
    });
  }
}
```

In this example, the `UserListComponent` implements the `OnInit` interface and overrides the `ngOnInit()` method. Inside the `ngOnInit()` method, we call the `fetchUsers()` method, which fetches the list of users from a service (`UserService`) asynchronously.

By placing the API call inside `ngOnInit()`, we ensure that it is executed only once when the component is initialized. This avoids unnecessary API calls if the component is reused or if there are changes that don't affect the initialization logic.

Additionally, we can further improve performance by using techniques such as lazy loading or data caching. If the `UserListComponent` is not immediately visible on the page or if the user data is static and doesn't change frequently, we can use lazy loading to load the component only when it becomes visible, reducing the initial page load time.

If the user data is not expected to change frequently, we can implement data caching strategies to store the fetched user data and avoid making redundant API calls. By caching the data, subsequent component instances or navigations to the component can retrieve the data from the cache, reducing network requests and improving performance.

---

### `ngDoCheck()`

Suppose we have a component called `OrderListComponent` that displays a list of orders. Each order has a status property that determines its appearance. We want to highlight the orders whose status has changed since the last change detection cycle.

Solution using `ngDoCheck()`: To solve this problem, we can utilize the `ngDoCheck()` lifecycle hook to compare the current and previous values of the order list and detect changes in the status property.

Here's an improved example implementation:

```ts
import { Component, DoCheck, Input, IterableDiffers } from "@angular/core";
import { Order } from "./order.model";

@Component({
  selector: "app-order-list",
  template: `
    <ul>
      <li *ngFor="let order of orders" [ngClass]="{ highlighted: isStatusChanged(order) }">{{ order.name }} - {{ order.status }}</li>
    </ul>
  `,
  styles: [
    `
      .highlighted {
        background-color: yellow;
      }
    `,
  ],
})
export class OrderListComponent implements DoCheck {
  @Input() orders: Order[];
  private previousOrders: Order[];
  private differ: any;

  constructor(private differs: IterableDiffers) {
    this.differ = this.differs.find([]).create();
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.orders);

    if (changes) {
      this.detectStatusChanges();
    }
  }

  private detectStatusChanges() {
    this.orders.forEach((order, index) => {
      const previousOrder = this.previousOrders[index];

      if (previousOrder && order.status !== previousOrder.status) {
        // Status has changed, perform necessary actions
        // For example, you can log or notify the user about the status change
        console.log(`Order ${order.name} status has changed from ${previousOrder.status} to ${order.status}`);
      }
    });

    this.previousOrders = this.orders.slice();
  }

  isStatusChanged(order: Order): boolean {
    const previousOrder = this.previousOrders.find((o) => o.id === order.id);
    return previousOrder && order.status !== previousOrder.status;
  }
}
```

In this example, the `OrderListComponent` implements the `DoCheck` interface and overrides the `ngDoCheck()` method. Inside `ngDoCheck()`, we use Angular's `IterableDiffers` to detect changes in the `orders` input property by comparing the current and previous values.

If changes are detected, we call the `detectStatusChanges()` method, which iterates through the orders and compares their statuses with the previous statuses. If a change is found, we can perform necessary actions, such as logging or notifying the user about the status change.

To optimize performance, we store a copy of the previous orders using `this.previousOrders` and compare the statuses only for the changed orders. This avoids unnecessary computations for unchanged orders, improving overall performance.

The `isStatusChanged()` method is used in the template to conditionally apply a CSS class (`highlighted`) to the orders whose status has changed. This provides a visual indication to the user.

By using `ngDoCheck()` in this way, we can efficiently detect and respond to changes in input properties that are arrays or objects. This helps ensure that relevant actions are taken when specific properties change, improving the accuracy and responsiveness of the component.

---

### `ngAfterContentInit()`

Suppose we have a component called `TabComponent` that represents a tab within a tabbed interface. Each tab has its own content, and we want to initialize and activate the first tab when the component is rendered.

Solution using `ngAfterContentInit()`: To solve this problem, we can utilize the `ngAfterContentInit()` lifecycle hook to initialize and activate the first tab by setting its active state.

Here's an example implementation:

```ts
import { Component, ContentChildren, QueryList, AfterContentInit } from "@angular/core";
import { TabComponent } from "./tab.component";

@Component({
  selector: "app-tabs",
  template: `
    <div class="tabs">
      <div class="tab" *ngFor="let tab of tabs" [class.active]="tab.isActive">
        <button (click)="selectTab(tab)">{{ tab.title }}</button>
      </div>
    </div>
    <div class="tab-content">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .tab {
        display: inline-block;
      }
      .tab button {
        background: none;
        border: none;
        cursor: pointer;
      }
      .tab.active {
        font-weight: bold;
      }
    `,
  ],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  ngAfterContentInit() {
    if (this.tabs.length > 0) {
      this.tabs.first.isActive = true; // Activate the first tab
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.forEach((t) => (t.isActive = false)); // Deactivate all tabs
    tab.isActive = true; // Activate the selected tab
  }
}
```

In this example, the `TabsComponent` implements the `AfterContentInit` interface and overrides the `ngAfterContentInit()` method. Inside this method, we check if there are any tabs present in the content projection (`<ng-content>`). If at least one tab is available, we set the `isActive` property of the first tab to `true`, making it the active tab.

By utilizing `ngAfterContentInit()`, we ensure that the initialization and activation of the first tab happen after the content has been projected into the component.

To further improve performance, consider the following points:

1.  Minimize the number of operations inside `ngAfterContentInit()`: Since this method is executed once after the content has been initialized, it's crucial to keep the logic within this method minimal. Avoid computationally expensive operations or complex business logic.

2.  Leverage change detection strategies: Angular provides different change detection strategies that can be applied to components. By using the `OnPush` change detection strategy, you can optimize performance by reducing the number of change detection cycles. This strategy can be combined with `ngAfterContentInit()` to achieve better performance in scenarios where the tab content rarely changes.

3.  Optimize tab content rendering: If the tab content is heavy or contains complex elements, you can consider lazy loading or using Angular's `ngTemplateOutlet` to defer rendering until the tab is activated. This approach can improve the initial rendering performance of the component.

---

### `ngAfterContentChecked()`

Suppose we have a component called `NotificationListComponent` that displays a list of notifications. Each notification has a property that determines its urgency level, and we want to highlight the urgent notifications after they have been checked for changes.

Solution using `ngAfterContentChecked()`: To solve this problem, we can utilize the `ngAfterContentChecked()` lifecycle hook to apply highlighting to the urgent notifications after the content has been checked for changes.

Here's an example implementation:

```ts
import { Component, ContentChildren, QueryList, AfterContentChecked } from "@angular/core";
import { NotificationComponent } from "./notification.component";

@Component({
  selector: "app-notification-list",
  template: `
    <div *ngFor="let notification of notifications" [class.urgent]="notification.isUrgent">
      {{ notification.message }}
    </div>
  `,
  styles: [
    `
      .urgent {
        background-color: red;
        color: white;
        font-weight: bold;
      }
    `,
  ],
})
export class NotificationListComponent implements AfterContentChecked {
  @ContentChildren(NotificationComponent) notifications: QueryList<NotificationComponent>;

  ngAfterContentChecked() {
    this.highlightUrgentNotifications();
  }

  private highlightUrgentNotifications() {
    this.notifications.forEach((notification) => {
      if (notification.isUrgent && !notification.isHighlighted) {
        notification.isHighlighted = true;
      }
    });
  }
}
```

In this example, the `NotificationListComponent` implements the `AfterContentChecked` interface and overrides the `ngAfterContentChecked()` method. Inside this method, we iterate over the `notifications` QueryList and check if any notification is both urgent (`isUrgent`) and not yet highlighted (`isHighlighted`). If such a notification is found, we set the `isHighlighted` property to `true`, applying the CSS class that provides the desired highlighting effect.

By utilizing `ngAfterContentChecked()`, we ensure that the highlighting of urgent notifications is performed after the content has been checked for changes, ensuring that all updates are reflected before applying the highlighting.

To further improve performance, consider the following points:

1.  Minimize the number of operations inside `ngAfterContentChecked()`: Since this method is executed after every change detection cycle, it's important to keep the logic within this method minimal. Avoid computationally expensive operations or complex business logic.

2.  Leverage change detection strategies: Angular provides different change detection strategies that can be applied to components. By using the `OnPush` change detection strategy, you can optimize performance by reducing the number of change detection cycles. This strategy can be combined with `ngAfterContentChecked()` to achieve better performance in scenarios where the notification list rarely changes.

3.  Optimize notification component rendering: If the notification component has complex rendering or heavy computations, consider optimizing its implementation. This can include lazy loading or optimizing the rendering of individual notifications using Angular's `ngTemplateOutlet` or other techniques.

---

### `ngAfterViewInit()`

Suppose we have a component called `ChartComponent` that renders a chart using a third-party library. We want to initialize and render the chart after the component's view has been initialized and rendered.

Solution using `ngAfterViewInit()`: To solve this problem, we can utilize the `ngAfterViewInit()` lifecycle hook to initialize and render the chart after the component's view has been initialized.

Here's an example implementation:

```ts
import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { ChartLibrary } from "chart-library";

@Component({
  selector: "app-chart",
  template: `<div #chartContainer></div>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ChartComponent implements AfterViewInit {
  @ViewChild("chartContainer") chartContainer: ElementRef;

  ngAfterViewInit() {
    this.initializeChart();
  }

  private initializeChart() {
    const chartElement = this.chartContainer.nativeElement;
    // Initialize and render the chart using the chart library
    const chart = new ChartLibrary(chartElement);
    chart.render();
  }
}
```

In this example, the `ChartComponent` implements the `AfterViewInit` interface and overrides the `ngAfterViewInit()` method. Inside this method, we access the `chartContainer` element reference using `@ViewChild` and then use it to initialize and render the chart using a third-party library.

By utilizing `ngAfterViewInit()`, we ensure that the chart initialization and rendering happen after the component's view has been fully initialized and rendered. This ensures that the DOM element referenced by `chartContainer` is available for the chart library to work with.

To further improve performance, consider the following points:

1.  Minimize the number of operations inside `ngAfterViewInit()`: Since this method is executed once after the view has been fully initialized, it's important to keep the logic within this method minimal. Avoid computationally expensive operations or complex business logic.

2.  Leverage change detection strategies: Angular provides different change detection strategies that can be applied to components. By using the `OnPush` change detection strategy, you can optimize performance by reducing the number of change detection cycles. This strategy can be combined with `ngAfterViewInit()` to achieve better performance in scenarios where the chart component rarely changes.

3.  Optimize chart rendering: If the chart rendering process is resource-intensive, consider optimizing it by implementing techniques such as lazy loading, data throttling, or chart rendering optimization strategies specific to the chart library being used.

---

### `ngAfterViewChecked()`

Suppose we have a component called `ScrollSpyComponent` that needs to perform some actions whenever the user scrolls within its view. We want to update the component's state or trigger additional logic based on the scroll position.

Solution using `ngAfterViewChecked()`: To solve this problem, we can utilize the `ngAfterViewChecked()` lifecycle hook to monitor the scroll position and perform the necessary actions accordingly.

Here's an example implementation:

```ts
import { Component, AfterViewChecked, ElementRef } from "@angular/core";

@Component({
  selector: "app-scroll-spy",
  template: `
    <div class="scroll-container" (scroll)="onScroll()">
      <!-- Content goes here -->
    </div>
  `,
  styles: [
    `
      .scroll-container {
        height: 300px;
        overflow-y: scroll;
      }
    `,
  ],
})
export class ScrollSpyComponent implements AfterViewChecked {
  private isScrolledToBottom = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewChecked() {
    this.checkScrollPosition();
  }

  private checkScrollPosition() {
    const element = this.elementRef.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    this.isScrolledToBottom = scrollTop + clientHeight === scrollHeight;
  }

  onScroll() {
    if (this.isScrolledToBottom) {
      // Perform actions when scrolled to the bottom
    }
  }
}
```

In this example, the `ScrollSpyComponent` implements the `AfterViewChecked` interface and overrides the `ngAfterViewChecked()` method. Inside this method, we check the scroll position of the component's view using the `scrollTop`, `scrollHeight`, and `clientHeight` properties of the native element obtained through `ElementRef`.

By utilizing `ngAfterViewChecked()`, we can continuously monitor the scroll position of the component's view. Whenever the user scrolls, the `onScroll()` event handler is triggered. In this example, we check if the scroll position is at the bottom of the scroll container and perform the necessary actions.

To further improve performance, consider the following points:

1.  Minimize the number of operations inside `ngAfterViewChecked()`: Since this method is executed after every change detection cycle, it's important to keep the logic within this method minimal. Avoid computationally expensive operations or complex business logic.

2.  Debounce or throttle event handling: If the `onScroll()` logic involves heavy computations or triggers expensive operations, it's recommended to debounce or throttle the event handling to avoid excessive updates and improve performance. This can be achieved using techniques like the `rxjs` `debounceTime()` or `throttleTime()` operators.

3.  Optimize rendering and DOM manipulation: If the content within the scroll container is dynamic and frequently updated, optimize the rendering and DOM manipulation to avoid unnecessary reflows and repaints. Use `ngFor` with `trackBy` to track changes efficiently and apply optimizations specific to your application's requirements.

---

### `ngOnDestroy()`

Suppose we have a component called `DataService` that manages a connection to a backend API. We need to ensure that the connection is properly closed and resources are released when the component is destroyed to prevent memory leaks and unwanted behavior.

Solution using `ngOnDestroy()`: To solve this problem, we can utilize the `ngOnDestroy()` lifecycle hook to clean up resources, such as unsubscribing from Observables or closing connections, before the component is destroyed.

Here's an example implementation:

```ts
import { Component, OnDestroy } from "@angular/core";
import { DataService } from "path/to/data.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-data",
  template: `<!-- Data display goes here -->`,
})
export class DataComponent implements OnDestroy {
  private dataSubscription: Subscription;

  constructor(private dataService: DataService) {
    this.dataSubscription = this.dataService.getData().subscribe((data) => {
      // Handle received data
    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    // Perform additional cleanup if needed
  }
}
```

In this example, the `DataComponent` implements the `OnDestroy` interface and overrides the `ngOnDestroy()` method. Inside this method, we unsubscribe from the `dataSubscription` to prevent memory leaks caused by ongoing subscriptions.

By utilizing `ngOnDestroy()`, we ensure that the necessary cleanup is performed when the component is destroyed, regardless of how the component is removed from the DOM or when its associated route is navigated away from.

To further improve performance, consider the following points:

1.  Unsubscribe from Observables: When working with Observables, it's crucial to unsubscribe from them to avoid memory leaks. Make sure to unsubscribe from any active subscriptions in the `ngOnDestroy()` method.

2.  Release resources: If the component is using resources other than Observables, such as timers, event listeners, or connections to external services, release those resources in the `ngOnDestroy()` method. This ensures that no unnecessary resources are kept active after the component is destroyed.

3.  Use takeUntil pattern: To simplify managing subscriptions and improve code readability, consider implementing the "takeUntil" pattern. This involves creating a `Subject` that emits a value when the component is being destroyed and using it with the `takeUntil` operator in your subscriptions. This pattern can help avoid repetitive `unsubscribe()` calls and makes it easier to handle multiple subscriptions.
