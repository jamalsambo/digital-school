<template>
  <q-layout view="lHh Lpr lFf">

    <!-- ══════════════ HEADER ══════════════ -->
    <q-header class="ed-header">
      <q-toolbar style="min-height:56px" class="q-px-lg">

        <q-btn flat round dense icon="menu" color="white" class="ed-header-btn q-mr-sm" @click="toggleLeftDrawer" />

        <div class="row items-center q-mr-lg no-wrap">
          <div class="ed-brand-icon q-mr-sm"><q-icon name="bolt" size="1rem" color="white" /></div>
          <span class="ed-brand-name">E-Digital</span>
        </div>

        <div class="row items-center" v-if="$q.screen.gt.sm" style="border-left:1px solid rgba(255,255,255,0.15);padding-left:0.9rem">
          <q-icon name="business" size="0.85rem" color="white" style="opacity:0.45" class="q-mr-xs" />
          <span style="font-size:0.78rem;color:rgba(255,255,255,0.5);max-width:180px" class="ellipsis">
            {{ institutionStores?.institution?.name || '—' }}
          </span>
        </div>

        <q-space />

        <!-- Fullscreen -->
        <q-btn flat round dense color="white" class="ed-header-btn q-mr-xs"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          v-if="$q.screen.gt.sm" @click="$q.fullscreen.toggle()" />

        <!-- Notifications -->
        <q-btn flat round dense color="white" icon="notifications_none" class="ed-header-btn q-mr-xs">
          <q-badge color="negative" floating rounded>5</q-badge>
          <q-menu anchor="bottom right" self="top right" style="border-radius:12px;min-width:300px">
            <div class="row items-center justify-between q-px-md q-py-sm" style="background:#fafbfd">
              <span style="font-family:'Sora',sans-serif;font-weight:700;font-size:0.88rem;color:#0f2862">Notificações</span>
              <q-badge color="negative" rounded>5 novas</q-badge>
            </div>
            <q-separator />
            <Messages />
            <q-separator />
            <div class="text-center q-pa-xs">
              <q-btn flat no-caps dense label="Ver todas" color="primary" size="sm" />
            </div>
          </q-menu>
        </q-btn>

        <!-- User menu -->
        <q-btn flat no-caps class="ed-user-btn">
          <div class="row items-center no-wrap" style="gap:7px">
            <q-avatar size="28px" style="background:rgba(255,255,255,0.18);border:1.5px solid rgba(255,255,255,0.28)">
              <q-icon name="person" size="0.9rem" color="white" />
            </q-avatar>
            <div v-if="$q.screen.gt.sm" style="line-height:1.2">
              <div style="font-size:0.74rem;font-weight:600;color:white">{{ user?.displayName || user?.username }}</div>
              <div style="font-size:0.62rem;color:rgba(255,255,255,0.5)">{{ user?.userType }}</div>
            </div>
            <q-icon name="expand_more" size="0.85rem" color="white" style="opacity:0.45" />
          </div>
          <q-menu anchor="bottom right" self="top right" style="border-radius:12px;min-width:230px">
            <div style="background:linear-gradient(135deg,#0a1f5c,#1a3fa6);padding:1rem;border-radius:12px 12px 0 0;display:flex;align-items:center;gap:10px">
              <div style="width:42px;height:42px;border-radius:10px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <q-icon name="person" size="1.3rem" color="white" />
              </div>
              <div>
                <div style="font-weight:700;font-size:0.88rem;color:white">{{ user?.displayName || user?.username }}</div>
                <div style="font-size:0.7rem;color:rgba(255,255,255,0.55)">{{ user?.userType }}</div>
              </div>
            </div>
            <q-separator />
            <q-list>
              <q-item clickable v-close-popup style="border-radius:8px;margin:4px 6px">
                <q-item-section avatar>
                  <div style="width:30px;height:30px;border-radius:8px;background:#eff6ff;display:flex;align-items:center;justify-content:center">
                    <q-icon name="manage_accounts" color="primary" size="0.95rem" />
                  </div>
                </q-item-section>
                <q-item-section>Perfil</q-item-section>
              </q-item>
              <q-separator class="q-my-xs" />
              <q-item clickable v-close-popup @click="handleLogout" style="border-radius:8px;margin:4px 6px">
                <q-item-section avatar>
                  <div style="width:30px;height:30px;border-radius:8px;background:#fff5f5;display:flex;align-items:center;justify-content:center">
                    <q-icon name="logout" color="negative" size="0.95rem" />
                  </div>
                </q-item-section>
                <q-item-section style="color:#dc2626;font-weight:600">Terminar Sessão</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

      </q-toolbar>
    </q-header>

    <!-- ══════════════ DRAWER ══════════════ -->
    <!--
      KEY FIX: Use dark prop on q-drawer so Quasar applies dark theme
      to all child q-item, q-expansion-item internals automatically.
      Then we only need to style our custom classes on top.
    -->
    <q-drawer v-model="leftDrawerOpen" show-if-above :width="256" dark
      style="background:linear-gradient(180deg,#0a1f5c 0%,#0f2862 50%,#0e2a6a 100%)">

      <!-- Sidebar Header -->
      <div class="ed-side-header">
        <div class="row items-center no-wrap" style="gap:10px;margin-bottom:10px">
          <div class="ed-side-logo-icon"><q-icon name="bolt" size="1.1rem" color="white" /></div>
          <div>
            <div class="ed-side-logo-name">E-Digital</div>
            <div style="font-size:0.62rem;color:rgba(255,255,255,0.38)">Sistema de Gestão</div>
          </div>
        </div>
        <div class="ed-user-pill">
          <q-icon name="person" size="0.8rem" style="opacity:0.6" />
          <span class="ellipsis" style="flex:1;min-width:0">{{ user?.displayName || user?.username }}</span>
          <span class="ed-role-tag">{{ user?.userType }}</span>
        </div>
      </div>

      <!-- Nav list -->
      <q-scroll-area style="height:calc(100% - 136px)">
        <q-list dark class="q-py-xs">

          <!-- Dashboard -->
          <q-item clickable to="/" exact class="ed-nav-item" active-class="ed-nav-active">
            <q-item-section avatar><div class="ed-nav-icon"><q-icon name="dashboard" size="1rem" /></div></q-item-section>
            <q-item-section class="ed-nav-label">Dashboard</q-item-section>
          </q-item>

          <!-- ══ SUPER ══ -->
          <template v-if="user?.userType === 'Super'">
            <div class="ed-nav-section">Administração</div>
            <q-expansion-item dark expand-icon-class="ed-expand-icon" header-class="ed-nav-item" expand-icon="keyboard_arrow_down">
              <template #header>
                <q-item-section avatar><div class="ed-nav-icon"><q-icon name="business" size="1rem" /></div></q-item-section>
                <q-item-section class="ed-nav-label">Instituição</q-item-section>
              </template>
              <q-item clickable to="/institutions" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Listar Instituições</q-item-section>
              </q-item>
              <q-item clickable to="/employees" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Funcionários</q-item-section>
              </q-item>
            </q-expansion-item>
            <q-item clickable to="/plans" active-class="ed-nav-active" class="ed-nav-item">
              <q-item-section avatar><div class="ed-nav-icon"><q-icon name="workspace_premium" size="1rem" /></div></q-item-section>
              <q-item-section class="ed-nav-label">Planos</q-item-section>
            </q-item>
          </template>

          <!-- ══ EMPLOYEE ══ -->
          <template v-if="authStore?.isEmployee">

            <template v-if="authStore.hasViewInstitution || authStore.hasViewRooms || authStore.hasViewHoraryInstitution">
              <div class="ed-nav-section">Instituição</div>
              <q-expansion-item dark expand-icon-class="ed-expand-icon" header-class="ed-nav-item" expand-icon="keyboard_arrow_down">
                <template #header>
                  <q-item-section avatar><div class="ed-nav-icon"><q-icon name="account_balance" size="1rem" /></div></q-item-section>
                  <q-item-section class="ed-nav-label">Instituição</q-item-section>
                </template>
                <q-item v-if="authStore.hasViewInstitution" clickable to="/institutions" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Listar</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasViewRooms" clickable to="/rooms" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Salas</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasViewInstitution" clickable to="/cycles" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Ciclos</q-item-section>
                </q-item>
                <q-expansion-item v-if="authStore.hasViewHoraryInstitution" dark expand-icon-class="ed-expand-icon" header-class="ed-nav-sub" expand-icon="keyboard_arrow_down">
                  <template #header>
                    <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                    <q-item-section class="ed-nav-label">Horários</q-item-section>
                  </template>
                  <q-item clickable to="/periods" active-class="ed-nav-active" class="ed-nav-sub2">
                    <q-item-section avatar><div class="ed-dot2"></div></q-item-section>
                    <q-item-section class="ed-nav-label">Listar</q-item-section>
                  </q-item>
                  <q-item clickable to="/periods/fixe/activity" active-class="ed-nav-active" class="ed-nav-sub2">
                    <q-item-section avatar><div class="ed-dot2"></div></q-item-section>
                    <q-item-section class="ed-nav-label">Actividades Fixas</q-item-section>
                  </q-item>
                  <q-item clickable to="/periods/fixes" active-class="ed-nav-active" class="ed-nav-sub2">
                    <q-item-section avatar><div class="ed-dot2"></div></q-item-section>
                    <q-item-section class="ed-nav-label">Horários Fixos</q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-expansion-item>
            </template>

            <div class="ed-nav-section">Académico</div>

            <q-item v-if="authStore.hasViewStudents" clickable to="/students" active-class="ed-nav-active" class="ed-nav-item">
              <q-item-section avatar><div class="ed-nav-icon"><q-icon name="diversity_3" size="1rem" /></div></q-item-section>
              <q-item-section class="ed-nav-label">Estudantes</q-item-section>
            </q-item>

            <q-item v-if="authStore.hasViewEmployees" clickable to="/employees" active-class="ed-nav-active" class="ed-nav-item">
              <q-item-section avatar><div class="ed-nav-icon"><q-icon name="groups_2" size="1rem" /></div></q-item-section>
              <q-item-section class="ed-nav-label">Funcionários</q-item-section>
            </q-item>

            <q-expansion-item
              v-if="authStore.hasViewCalendar || authStore.hasViewEvolutionTypes || authStore.hasCreateDisciplines || authStore.hasCreateCurriculum || authStore.hasViewEvolutionGrade"
              dark expand-icon-class="ed-expand-icon" header-class="ed-nav-item" expand-icon="keyboard_arrow_down"
            >
              <template #header>
                <q-item-section avatar><div class="ed-nav-icon"><q-icon name="school" size="1rem" /></div></q-item-section>
                <q-item-section class="ed-nav-label">Controlo Académico</q-item-section>
              </template>
              <q-item v-if="authStore.hasViewCalendar" clickable to="/academic-calendar" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Calendário Académico</q-item-section>
              </q-item>
              <q-item v-if="authStore.hasViewEvolutionTypes" clickable to="/evolution/types" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Tipos de Avaliação</q-item-section>
              </q-item>
              <q-item v-if="authStore.hasCreateDisciplines" clickable :to="`/education/${educationLevel?.id}/module${getRouteForDiscipline(educationLevel?.name)}`" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">{{ getNameForDiscipline(educationLevel?.name) }}</q-item-section>
              </q-item>
              <q-item v-if="authStore.hasCreateCurriculum" clickable :to="`/education/${educationLevel?.id}/curriculums`" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Planos Curriculares</q-item-section>
              </q-item>
              <q-item v-if="authStore.hasCreateClasse" clickable :to="`/education/${educationLevel?.id}${getRoute(educationLevel?.name)}`" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">{{ getName(educationLevel?.name) }}</q-item-section>
              </q-item>
              <q-item v-if="authStore?.hasViewEnrollment" clickable :to="`/education/${educationLevel?.id}/enrollments`" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Matrículas</q-item-section>
              </q-item>
              <q-item v-if="authStore?.hasViewBulletins" clickable to="/academic-control" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Académico</q-item-section>
              </q-item>
            </q-expansion-item>

            <template v-if="authStore.hasViewInvoices || authStore.hasViewReceipts || authStore.hasViewPaymentsExtras">
              <div class="ed-nav-section">Financeiro</div>
              <q-expansion-item dark expand-icon-class="ed-expand-icon" header-class="ed-nav-item" expand-icon="keyboard_arrow_down">
                <template #header>
                  <q-item-section avatar><div class="ed-nav-icon"><q-icon name="account_balance_wallet" size="1rem" /></div></q-item-section>
                  <q-item-section class="ed-nav-label">Controlo Financeiro</q-item-section>
                </template>
                <q-item v-if="authStore.hasViewInvoices" clickable to="/finance/report/" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Relatório</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasViewInvoices" clickable :to="`/finance/institution/${user.institutionId}/invoices/`" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Facturas</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasViewReceipts" clickable :to="`/finance/institution/${user.institutionId}/receipts/`" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Recibos</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasViewPaymentsTypes" clickable :to="`/finance/institution/${user.institutionId}/payment-types/`" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Tipos de Pagamento</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasViewPaymentsExtras" clickable to="/extras-fees" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Pagamentos Extras</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasViewExpensesCategories" clickable to="/finance/expenses-categories" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Categorias de Despesas</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasViewExpenses" clickable to="/finance/expenses" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Despesas</q-item-section>
                </q-item>
              </q-expansion-item>
            </template>

            <template v-if="authStore.hasCreateInStock || authStore.hasCreateOutStock">
              <div class="ed-nav-section">Estoque</div>
              <q-expansion-item dark expand-icon-class="ed-expand-icon" header-class="ed-nav-item" expand-icon="keyboard_arrow_down">
                <template #header>
                  <q-item-section avatar><div class="ed-nav-icon"><q-icon name="inventory_2" size="1rem" /></div></q-item-section>
                  <q-item-section class="ed-nav-label">Controlo de Estoque</q-item-section>
                </template>
                <q-item v-if="authStore.hasMoveStock" clickable to="/stock/move" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Movimentos</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasCreateInStock" clickable to="/stock/move/in" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Entrada</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasCreateOutStock" clickable to="/stock/move/out/" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Saída</q-item-section>
                </q-item>
                <q-expansion-item dark expand-icon-class="ed-expand-icon" header-class="ed-nav-sub" expand-icon="keyboard_arrow_down">
                  <template #header>
                    <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                    <q-item-section class="ed-nav-label">Produtos</q-item-section>
                  </template>
                  <q-item v-if="authStore.hasViewProductStock" clickable to="/stock/products" active-class="ed-nav-active" class="ed-nav-sub2">
                    <q-item-section avatar><div class="ed-dot2"></div></q-item-section>
                    <q-item-section class="ed-nav-label">Listar</q-item-section>
                  </q-item>
                  <q-item v-if="authStore.hasViewCategoryStock" clickable to="/stock/products/categories" active-class="ed-nav-active" class="ed-nav-sub2">
                    <q-item-section avatar><div class="ed-dot2"></div></q-item-section>
                    <q-item-section class="ed-nav-label">Categorias</q-item-section>
                  </q-item>
                  <q-item v-if="authStore.hasViewSuplierStock" clickable to="/stock/products/suppliers" active-class="ed-nav-active" class="ed-nav-sub2">
                    <q-item-section avatar><div class="ed-dot2"></div></q-item-section>
                    <q-item-section class="ed-nav-label">Fornecedores</q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-expansion-item>
            </template>

            <template v-if="authStore.hasMoveAsset || authStore.hasViewAsset">
              <div class="ed-nav-section">Patrimónios</div>
              <q-expansion-item dark expand-icon-class="ed-expand-icon" header-class="ed-nav-item" expand-icon="keyboard_arrow_down">
                <template #header>
                  <q-item-section avatar><div class="ed-nav-icon"><q-icon name="domain" size="1rem" /></div></q-item-section>
                  <q-item-section class="ed-nav-label">Patrimónios</q-item-section>
                </template>
                <q-item v-if="authStore.hasMoveAsset" clickable to="/assets/move" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Movimentos</q-item-section>
                </q-item>
                <q-item v-if="authStore.hasViewAsset" clickable to="/assets/" active-class="ed-nav-active" class="ed-nav-sub">
                  <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                  <q-item-section class="ed-nav-label">Listar</q-item-section>
                </q-item>
              </q-expansion-item>
            </template>

            <template v-if="authStore.hasViewNotifications || authStore.hasCreateNotifications">
              <div class="ed-nav-section">Comunicação</div>
              <q-item clickable to="/notifications" active-class="ed-nav-active" class="ed-nav-item">
                <q-item-section avatar><div class="ed-nav-icon"><q-icon name="notifications" size="1rem" /></div></q-item-section>
                <q-item-section class="ed-nav-label">Notificações</q-item-section>
              </q-item>
            </template>

            <q-item v-if="authStore.isTeacher" clickable :to="`/employee/${authStore.user?.employeeId}/classes`" active-class="ed-nav-active" class="ed-nav-item">
              <q-item-section avatar><div class="ed-nav-icon"><q-icon name="co_present" size="1rem" /></div></q-item-section>
              <q-item-section class="ed-nav-label">Minhas Turmas</q-item-section>
            </q-item>

          </template>

          <!-- ══ STUDENT ══ -->
          <template v-if="authStore.isStudent">
            <div class="ed-nav-section">Área do Estudante</div>
            <q-item clickable :to="`/student/${authStore?.user?.studentId}/evolutions/normal`" active-class="ed-nav-active" class="ed-nav-item">
              <q-item-section avatar><div class="ed-nav-icon"><q-icon name="emoji_symbols" size="1rem" /></div></q-item-section>
              <q-item-section class="ed-nav-label">Notas</q-item-section>
            </q-item>
            <q-item clickable :to="`/student/${authStore?.user?.studentId}/enrollments`" active-class="ed-nav-active" class="ed-nav-item">
              <q-item-section avatar><div class="ed-nav-icon"><q-icon name="school" size="1rem" /></div></q-item-section>
              <q-item-section class="ed-nav-label">Matrículas</q-item-section>
            </q-item>
            <q-item clickable :to="`/student/${authStore?.user?.studentId}/payments/`" active-class="ed-nav-active" class="ed-nav-item">
              <q-item-section avatar><div class="ed-nav-icon"><q-icon name="payments" size="1rem" /></div></q-item-section>
              <q-item-section class="ed-nav-label">Pagamentos</q-item-section>
            </q-item>
            <q-item clickable :to="`/student/${authStore?.user?.studentId}/attendances`" active-class="ed-nav-active" class="ed-nav-item">
              <q-item-section avatar><div class="ed-nav-icon"><q-icon name="how_to_reg" size="1rem" /></div></q-item-section>
              <q-item-section class="ed-nav-label">Presenças</q-item-section>
            </q-item>
            <q-item clickable :to="`/student/${authStore?.user?.studentId}/my-tasks`" active-class="ed-nav-active" class="ed-nav-item">
              <q-item-section avatar><div class="ed-nav-icon"><q-icon name="task_alt" size="1rem" /></div></q-item-section>
              <q-item-section class="ed-nav-label">Tarefas</q-item-section>
            </q-item>
          </template>

          <!-- ══ GUARDIAN ══ -->
          <template v-if="authStore.isGuardian">
            <div class="ed-nav-section">Área do Encarregado</div>
            <q-expansion-item
              v-for="student in students" :key="student.id"
              dark expand-icon-class="ed-expand-icon" header-class="ed-nav-item" expand-icon="keyboard_arrow_down"
            >
              <template #header>
                <q-item-section avatar>
                  <q-avatar size="26px" style="background:rgba(255,255,255,0.14);border:1px solid rgba(255,255,255,0.2)">
                    <q-icon name="person" size="0.8rem" color="white" />
                  </q-avatar>
                </q-item-section>
                <q-item-section class="ed-nav-label ellipsis">{{ student?.basicInformation?.fullName || 'Estudante' }}</q-item-section>
              </template>
              <q-item clickable :to="`/student/${student.id}/evolutions/normal`" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Notas</q-item-section>
              </q-item>
              <q-item clickable :to="`/student/${student.id}/enrollments`" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Matrículas</q-item-section>
              </q-item>
              <q-item clickable :to="`/student/${student.id}/payments/`" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Pagamentos</q-item-section>
              </q-item>
              <q-item clickable :to="`/student/${student.id}/attendances`" active-class="ed-nav-active" class="ed-nav-sub">
                <q-item-section avatar><div class="ed-dot"></div></q-item-section>
                <q-item-section class="ed-nav-label">Presenças</q-item-section>
              </q-item>
            </q-expansion-item>
          </template>

        </q-list>
      </q-scroll-area>

      <!-- Sidebar Footer -->
      <div class="ed-side-footer">
        <span style="font-size:0.67rem;color:rgba(255,255,255,0.28)">E-Digital © {{ new Date().getFullYear() }}</span>
        <q-btn flat round dense icon="logout" size="xs" color="white" style="opacity:0.35" @click="handleLogout">
          <q-tooltip>Terminar Sessão</q-tooltip>
        </q-btn>
      </div>

    </q-drawer>

    <!-- ══════════════ PAGE ══════════════ -->
    <q-page-container style="background:#eef2f7">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import Messages from "./Messages.vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/pages/auth/store";
import { useStudentStores } from "src/pages/student/store";
import { useUserStores } from "src/pages/user/store";
import { useInstitutionStores } from "src/pages/institution/store";
import useNotify from "src/composables/UseNotify";

const router = useRouter();
const authStore = useAuthStore();
const studentStores = useStudentStores();
const institutionStores = useInstitutionStores();
const userStores = useUserStores();
const { notifyError, notifyInfo } = useNotify();

const leftDrawerOpen = ref(false);
const $q = useQuasar();
const user = computed(() => authStore.user);
const students = computed(() => studentStores.students);
const educationLevel = ref(null);

const getName = (name) => {
  switch (name) {
    case "Ensino Infantil":    return "Estágios";
    case "Ensino Fundamental":
    case "Ensino Médio":       return "Classes";
    case "Ensino Técnico":
    case "Ensino Livre":       return "Cursos";
    default:                   return "Turmas";
  }
};
const getNameForDiscipline = (name) => name === "Ensino Infantil" ? "Actividades" : "Disciplinas";
const getRoute = (name) => {
  switch (name) {
    case "Ensino Infantil":    return "/internships";
    case "Ensino Fundamental":
    case "Ensino Médio":       return "/classes";
    default:                   return "/courses";
  }
};
const getRouteForDiscipline = (name) => name === "Ensino Infantil" ? "/activities" : "/disciplines";

const handleLogout = () => {
  try {
    authStore.signOut();
    notifyInfo("Sessão terminada com sucesso!");
    router.push("/login");
  } catch (error) {
    notifyError("Erro ao terminar sessão.");
  }
};
const toggleLeftDrawer = () => { leftDrawerOpen.value = !leftDrawerOpen.value; };

const fetchInstitution = async () => {
  try {
    await institutionStores.findOne(user.value.institutionId);
    educationLevel.value = institutionStores.institution.educationLevel;
  } catch (error) {
    notifyError("Erro ao carregar instituição.");
  }
};

onMounted(async () => {
  await fetchInstitution();
  if (user.value?.userType === "Encarregado") {
    try {
      await studentStores.list({ telephone: user.value.username, owner: "Encarregado", telephoneType: "Principal" });
    } catch (error) {
      notifyError("Erro ao carregar estudantes.");
    }
  }
});
</script>

<!-- Global styles needed to override Quasar internals in the drawer -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── HEADER ── */
.ed-header {
  background: linear-gradient(135deg, #0a1f5c 0%, #1a3fa6 60%, #1565c0 100%) !important;
  box-shadow: 0 2px 20px rgba(10,31,92,0.25) !important;
}
.ed-brand-icon {
  width: 28px; height: 28px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
}
.ed-brand-name {
  font-family: 'Sora', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.2px;
}
.ed-header-btn {
  background: rgba(255,255,255,0.08) !important;
  border-radius: 9px !important;
}
.ed-header-btn:hover { background: rgba(255,255,255,0.16) !important; }
.ed-user-btn {
  background: rgba(255,255,255,0.09) !important;
  border-radius: 10px !important;
  padding: 4px 9px !important;
  height: 42px !important;
}
.ed-user-btn:hover { background: rgba(255,255,255,0.17) !important; }

/* ── DRAWER SHELL ── */
.ed-side-header {
  padding: 1rem 0.9rem 0.85rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.ed-side-logo-icon {
  width: 34px; height: 34px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ed-side-logo-name {
  font-family: 'Sora', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
}
.ed-user-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 7px;
  padding: 5px 9px;
  font-size: 0.73rem;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
}
.ed-role-tag {
  margin-left: auto;
  flex-shrink: 0;
  background: rgba(255,255,255,0.12);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 0.6rem;
  color: rgba(255,255,255,0.7);
  font-weight: 700;
  letter-spacing: 0.04em;
}
.ed-side-footer {
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 0.55rem 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ── NAV SECTION LABELS ── */
.ed-nav-section {
  font-size: 0.59rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.28);
  padding: 0.85rem 1.1rem 0.25rem;
  font-family: 'Sora', sans-serif;
}

/* ── NAV LABELS (text inside items) ── */
.ed-nav-label {
  font-family: 'DM Sans', sans-serif !important;
  font-size: 0.855rem !important;
  color: rgba(255,255,255,0.72) !important;
  font-weight: 500 !important;
}

/* ── NAV ITEMS — the key: override Quasar's q-item directly ── */
.ed-nav-item.q-item {
  border-radius: 9px !important;
  margin: 1px 7px !important;
  min-height: 38px !important;
  padding: 4px 8px !important;
  color: rgba(255,255,255,0.72) !important;
  transition: background 0.15s !important;
}
.ed-nav-item.q-item:hover,
.ed-nav-item.q-item--dark:hover {
  background: rgba(255,255,255,0.09) !important;
  color: #ffffff !important;
}
.ed-nav-item.q-item:hover .ed-nav-label,
.ed-nav-active .ed-nav-label {
  color: #ffffff !important;
}
.ed-nav-active.q-item {
  background: rgba(255,255,255,0.16) !important;
  color: #ffffff !important;
  font-weight: 600 !important;
}

/* Expansion item header uses same class */
.ed-nav-item.q-expansion-item__container > .q-item,
.q-expansion-item .ed-nav-item {
  border-radius: 9px !important;
  margin: 1px 7px !important;
  min-height: 38px !important;
  padding: 4px 8px !important;
  color: rgba(255,255,255,0.72) !important;
}
.q-expansion-item .ed-nav-item:hover {
  background: rgba(255,255,255,0.09) !important;
}

/* Expand icon */
.ed-expand-icon.q-expansion-item__toggle-icon {
  color: rgba(255,255,255,0.3) !important;
  font-size: 1.1rem !important;
}

/* Expansion content background */
.q-drawer .q-expansion-item__content {
  background: rgba(0,0,0,0.15) !important;
}

/* ── SUB ITEMS ── */
.ed-nav-sub.q-item {
  border-radius: 8px !important;
  margin: 1px 7px 1px 24px !important;
  min-height: 33px !important;
  padding: 3px 8px !important;
  color: rgba(255,255,255,0.52) !important;
  font-size: 0.82rem !important;
  transition: background 0.15s !important;
}
.ed-nav-sub.q-item:hover {
  background: rgba(255,255,255,0.07) !important;
  color: rgba(255,255,255,0.9) !important;
}
.ed-nav-sub.q-item:hover .ed-nav-label,
.ed-nav-sub.ed-nav-active .ed-nav-label {
  color: rgba(255,255,255,0.95) !important;
}
.ed-nav-sub.ed-nav-active.q-item {
  background: rgba(255,255,255,0.11) !important;
  color: #ffffff !important;
}

/* ── SUB-SUB ITEMS ── */
.ed-nav-sub2.q-item {
  border-radius: 7px !important;
  margin: 1px 7px 1px 38px !important;
  min-height: 30px !important;
  padding: 2px 8px !important;
  color: rgba(255,255,255,0.4) !important;
  font-size: 0.8rem !important;
  transition: background 0.15s !important;
}
.ed-nav-sub2.q-item:hover {
  background: rgba(255,255,255,0.06) !important;
  color: rgba(255,255,255,0.85) !important;
}

/* ── ICON WRAP ── */
.ed-nav-icon {
  width: 26px; height: 26px;
  border-radius: 6px;
  background: rgba(255,255,255,0.09);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.6) !important;
  flex-shrink: 0;
  transition: background 0.15s;
}
.ed-nav-item.q-item:hover .ed-nav-icon,
.ed-nav-active .ed-nav-icon {
  background: rgba(255,255,255,0.18);
  color: #ffffff !important;
}
/* Force icon colour inside the wrap */
.ed-nav-icon .q-icon {
  color: inherit !important;
}

/* ── DOTS ── */
.ed-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.22);
  margin: auto;
  transition: background 0.15s;
}
.ed-nav-sub.q-item:hover .ed-dot,
.ed-nav-sub.ed-nav-active .ed-dot { background: rgba(255,255,255,0.7); }
.ed-dot2 {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: rgba(255,255,255,0.14);
  margin: auto;
}
.ed-nav-sub2.q-item:hover .ed-dot2 { background: rgba(255,255,255,0.55); }

/* ── SCROLL AREA THUMB ── */
.q-drawer .q-scrollarea__thumb { background: rgba(255,255,255,0.18) !important; }
</style>
