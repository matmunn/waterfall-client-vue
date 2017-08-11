<template>
<div>
  <section class="hero is-primary is-bold">
    <div class="hero-head">
      <header class="nav">
        <div class="container">
          <div class="nav-left">
            <div class="nav-item">
              Welcome back, {{ userName }}
            </div>
          </div>
          <div class="nav-right">
            <router-link to='/' class="nav-item">Back to week view</router-link>
            <router-link to='/logout' class="nav-item">Logout</router-link>
          </div>
        </div>
      </header>
    </div>
    <div class="hero-body">
      <div class="container">
        <router-link to="/admin">
          <div class="logo" v-html='logoSvg'></div>
        </router-link>
      </div>
    </div>
  </section>
  <section>
    <div class="columns">
      <div class="column is-3">
        <aside class="menu nav-menu">
          <p class="menu-label">
            Tasks
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/admin/tasks">My Tasks</router-link>
            </li>
            <li>
              <router-link to='/admin/tasks/mine'>Tasks I've Added</router-link>
            </li>
            <li>
              <router-link to="/admin/tasks/add">Add Task</router-link>
            </li>
          </ul>
          <p class="menu-label">
            Users
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/admin/users">Users List</router-link>
            </li>
            <li>
              <router-link to="/admin/users/add">Add User</router-link>
            </li>
          </ul>
          <p class="menu-label">
            Categories
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/admin/categories">Categories List</router-link>
            </li>
            <li>
              <router-link to="/admin/categories/add">Add Category</router-link>
            </li>
          </ul>
          <p class="menu-label">
            Clients
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/admin/clients">Clients List</router-link>
            </li>
            <li>
              <router-link to="/admin/clients/add">Add Client</router-link>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <!-- <div class="container"> -->
          <router-view></router-view>
        <!-- </div> -->
      </div>
    </div>
  </section>
</div>
</template>

<style scoped lang="scss">
@import "src/assets/styles/brand";

.header {
  background-color: $general-grey;
}
.wip-link {
  margin: 0.8vh auto;
  text-align: center;
}
.navbar {
  width: 20%;
  float: left;
  background-color: $dark-blue;
}
.content {
  width: 80%;
  float: left;
}
</style>

<script>
import Auth from 'Auth'
import logo from '../../../static/img/logo.svg'

export default {
  name: 'AdminRoute',
  computed: {
    userName () {
      return Auth.getUser().name
    }
  },
  data () {
    return {
      logoSvg: logo
    }
  }
}
</script>
