<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- LOGO + Nome -->
        <q-toolbar-title class="row items-center">
          <q-avatar>
            <img
              :src="`${apiUrl}/upload/${institution?.logo}`"
              alt="Logo da Escola X"
            />
          </q-avatar>
          <span class="q-ml-md">{{ institution?.name }}</span>
        </q-toolbar-title>

        <!-- Ícone de menu (aparece apenas em telas pequenas) -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="q-mr-sm lt-md"
          @click="drawerOpen = !drawerOpen"
        />

        <!-- Tabs (escondido em telas pequenas) -->
        <q-tabs
          v-model="tab"
          align="center"
          indicator-color="secondary"
          active-color="white"
          narrow-indicator
          class="gt-sm"
        >
          <q-tab name="inicio" label="Início" />

          <!-- Menu suspenso para Ensinos -->
          <q-btn-dropdown label="Ensinos" flat="">
            <q-list>
              <q-item clickable v-close-popup v-for="(item, index) in educationsLevels" :key="index">
                <q-tab name="cursos" :label="item.name" />
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-tab name="professores" label="Professores" />
          <q-tab name="inscricoes" label="Inscrições" />
          <q-btn label="Login" href="http://localhost:9000/" target="_blank" />
        </q-tabs>
      </q-toolbar>

      <!-- Menu lateral para dispositivos móveis -->
      <q-drawer v-model="drawerOpen" side="left" overlay>
        <q-list>
          <q-item
            class="text-black"
            clickable
            v-ripple
            @click="
              tab = 'inicio';
              drawerOpen = false;
            "
          >
            <q-item-section>Início</q-item-section>
          </q-item>

          <!-- Menu Ensinos no Drawer -->
          <q-expansion-item class="text-black" label="Ensinos" expand-separator>
            <q-item
              class="text-black"
              clickable
              v-ripple
              @click="
                tab = 'fundamental';
                drawerOpen = false;
              "
            >
              <q-item-section>Ensino Fundamental</q-item-section>
            </q-item>
            <q-item
              class="text-black"
              clickable
              v-ripple
              @click="
                tab = 'medio';
                drawerOpen = false;
              "
            >
              <q-item-section>Ensino Médio</q-item-section>
            </q-item>
            <q-item
              class="text-black"
              clickable
              v-ripple
              @click="
                tab = 'tecnico';
                drawerOpen = false;
              "
            >
              <q-item-section>Ensino Técnico</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item
            class="text-black"
            clickable
            v-ripple
            @click="
              tab = 'professores';
              drawerOpen = false;
            "
          >
            <q-item-section>Professores</q-item-section>
          </q-item>

          <q-item
            class="text-black"
            clickable
            v-ripple
            @click="
              tab = 'inscricoes';
              drawerOpen = false;
            "
          >
            <q-item-section>Inscrições</q-item-section>
          </q-item>

          <q-item class="text-black" clickable v-ripple>
            <q-item-section>
              <q-btn
                label="Login"
                href="http://localhost:9000/"
                target="_blank"
                flat
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
    </q-header>

    <q-page-container>
      <!-- CONTEÚDO PRINCIPAL COM TABS -->
      <q-page padding>
        <q-tab-panels v-model="tab" animated swipeable class="bg-transparent">
          <!-- PAINEL INÍCIO -->
          <q-tab-panel name="inicio">
            <!-- Banner principal -->
            <div class="q-pa-md">
              <q-carousel
                swipeable
                animated
                v-model="slide1"
                :autoplay="autoplay"
                infinite
                arrows
                control-color="primary"
                navigation
                height="400px"
                class="rounded-borders"
              >
                <q-carousel-slide
                  v-for="(item, index) in mainCarroselImagens"
                  :key="index"
                  :name="index"
                  :img-src="`${apiUrl}/upload/${item.imagen}`"
                >
                  <div class="absolute-bottom custom-caption">
                    <div class="text-subtitle1">{{ item.description }}</div>
                  </div>
                </q-carousel-slide>
              </q-carousel>
            </div>

            <!-- História/Sobre a Escola -->
            <div class="q-pa-md q-my-md bg-grey-2">
              <div class="row items-center">
                <div class="col-12 col-md-6 q-pa-md">
                  <div class="text-h4 text-primary q-mb-md">Nossa História</div>
                  <div v-html="institution?.aboutUs" class="preview-content" />
                </div>
                <div class="col-12 col-md-6 q-pa-md text-center">
                  <q-carousel
                    swipeable
                    animated
                    v-model="slide"
                    arrows
                    control-color="primary"
                    navigation
                    height="400px"
                    class="rounded-borders"
                    :autoplay="autoplay"
                    infinite
                  >
                    <q-carousel-slide
                      v-for="(item, index) in aboutUsCarroselImagens"
                      :key="index"
                      :name="index"
                      :img-src="`${apiUrl}/upload/${item.imagen}`"
                    >
                      <div class="absolute-bottom custom-caption">
                        <div class="text-subtitle1">{{ item.description }}</div>
                      </div>
                    </q-carousel-slide>
                  </q-carousel>
                </div>
              </div>
            </div>

            <!-- Seção de "Por que escolher" e "Programas" -->
            <div class="row q-col-gutter-md q-py-lg">
              <div class="col-12 col-md-6">
                <q-card class="full-height">
                  <q-card-section class="bg-secondary text-white">
                    <div class="text-h5">
                      Por que escolher a {{ institution?.name }}?
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="q-py-sm">
                      <div class="row items-center q-mb-md">
                        <q-icon
                          name="school"
                          size="2rem"
                          color="primary"
                          class="q-mr-md"
                        />
                        <div>
                          <div class="text-subtitle1 text-weight-bold">
                            Educação de Qualidade
                          </div>
                          <div class="text-body2">
                            Oferecemos o melhor ensino com professores
                            qualificados
                          </div>
                        </div>
                      </div>
                      <div class="row items-center q-mb-md">
                        <q-icon
                          name="psychology"
                          size="2rem"
                          color="primary"
                          class="q-mr-md"
                        />
                        <div>
                          <div class="text-subtitle1 text-weight-bold">
                            Desenvolvimento Integral
                          </div>
                          <div class="text-body2">
                            Focamos no crescimento acadêmico e pessoal dos
                            alunos
                          </div>
                        </div>
                      </div>
                      <div class="row items-center q-mb-md">
                        <q-icon
                          name="emoji_events"
                          size="2rem"
                          color="primary"
                          class="q-mr-md"
                        />
                        <div>
                          <div class="text-subtitle1 text-weight-bold">
                            Reconhecimento
                          </div>
                          <div class="text-body2">
                            Nossa instituição é reconhecida pela excelência no
                            ensino
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-card class="full-height">
                  <q-card-section class="bg-primary text-white">
                    <div class="text-h5">Programas e Estudantes</div>
                  </q-card-section>
                  <q-card-section>
                    <div class="q-py-sm">
                      <div class="row items-center q-mb-md">
                        <q-icon
                          name="computer"
                          size="2rem"
                          color="secondary"
                          class="q-mr-md"
                        />
                        <div>
                          <div class="text-subtitle1 text-weight-bold">
                            Cursos Tecnológicos
                          </div>
                          <div class="text-body2">
                            Programação, Design, Robótica e muito mais
                          </div>
                        </div>
                      </div>
                      <div class="row items-center q-mb-md">
                        <q-icon
                          name="language"
                          size="2rem"
                          color="secondary"
                          class="q-mr-md"
                        />
                        <div>
                          <div class="text-subtitle1 text-weight-bold">
                            Cursos de Idiomas
                          </div>
                          <div class="text-body2">
                            Inglês, Espanhol, Francês e Mandarim
                          </div>
                        </div>
                      </div>
                      <div class="row items-center">
                        <q-icon
                          name="diversity_3"
                          size="2rem"
                          color="secondary"
                          class="q-mr-md"
                        />
                        <div>
                          <div class="text-subtitle1 text-weight-bold">
                            Comunidade Estudantil
                          </div>
                          <div class="text-body2">
                            Mais de 1000 alunos formados anualmente
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div class="q-pa-md q-my-md bg-grey-2">
              <div class="text-h4 text-primary q-mb-md">Eventos</div>
              <div class="row q-col-gutter-sm q-py-lg">
                <div class="col-12 col-md-4">
                  <q-card class="my-card" flat bordered>
                    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />

                    <q-card-section>
                      <div class="text-overline text-orange-9">Overline</div>
                      <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
                      <div class="text-caption text-grey">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </div>
                    </q-card-section>

                    <q-card-actions>
                      <q-btn flat color="primary" label="Share" />
                      <q-btn flat color="secondary" label="Book" />

                      <q-space />

                      <q-btn
                        color="grey"
                        round
                        flat
                        dense
                        :icon="
                          expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                        "
                        @click="expanded = !expanded"
                      />
                    </q-card-actions>

                    <q-slide-transition>
                      <div v-show="expanded">
                        <q-separator />
                        <q-card-section class="text-subtitle2">
                          {{ lorem }}
                        </q-card-section>
                      </div>
                    </q-slide-transition>
                  </q-card>
                </div>

                <div class="col-12 col-md-4">
                  <q-card class="my-card" flat bordered>
                    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />

                    <q-card-section>
                      <div class="text-overline text-orange-9">Overline</div>
                      <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
                      <div class="text-caption text-grey">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </div>
                    </q-card-section>

                    <q-card-actions>
                      <q-btn flat color="primary" label="Share" />
                      <q-btn flat color="secondary" label="Book" />

                      <q-space />

                      <q-btn
                        color="grey"
                        round
                        flat
                        dense
                        :icon="
                          expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                        "
                        @click="expanded = !expanded"
                      />
                    </q-card-actions>

                    <q-slide-transition>
                      <div v-show="expanded">
                        <q-separator />
                        <q-card-section class="text-subtitle2">
                          {{ lorem }}
                        </q-card-section>
                      </div>
                    </q-slide-transition>
                  </q-card>
                </div>

                <div class="col-12 col-md-4">
                  <q-card class="my-card" flat bordered>
                    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />

                    <q-card-section>
                      <div class="text-overline text-orange-9">Overline</div>
                      <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
                      <div class="text-caption text-grey">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </div>
                    </q-card-section>

                    <q-card-actions>
                      <q-btn flat color="primary" label="Share" />
                      <q-btn flat color="secondary" label="Book" />

                      <q-space />

                      <q-btn
                        color="grey"
                        round
                        flat
                        dense
                        :icon="
                          expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                        "
                        @click="expanded = !expanded"
                      />
                    </q-card-actions>

                    <q-slide-transition>
                      <div v-show="expanded">
                        <q-separator />
                        <q-card-section class="text-subtitle2">
                          {{ lorem }}
                        </q-card-section>
                      </div>
                    </q-slide-transition>
                  </q-card>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- PAINEL CURSOS -->
          <q-tab-panel name="cursos">
            <div class="text-h4 text-primary q-mb-lg">Nossos Cursos</div>

            <!-- Categorias de cursos -->
            <div class="row q-col-gutter-md">
              <!-- Tecnologia -->
              <div class="col-12 col-md-4 q-mb-md">
                <q-card class="curso-card">
                  <q-img src="/api/placeholder/400/200">
                    <div
                      class="absolute-bottom text-subtitle1 text-center bg-primary text-white q-pa-xs"
                    >
                      Tecnologia
                    </div>
                  </q-img>
                  <q-card-section>
                    <div class="text-h6">Cursos de Tecnologia</div>
                    <q-list dense>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="code" color="primary" />
                        </q-item-section>
                        <q-item-section>Desenvolvimento Web</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="smartphone" color="primary" />
                        </q-item-section>
                        <q-item-section>Desenvolvimento Mobile</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon
                            name="precision_manufacturing"
                            color="primary"
                          />
                        </q-item-section>
                        <q-item-section>Robótica</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="security" color="primary" />
                        </q-item-section>
                        <q-item-section>Cibersegurança</q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat color="primary" label="Ver Detalhes" />
                  </q-card-actions>
                </q-card>
              </div>

              <!-- Idiomas -->
              <div class="col-12 col-md-4 q-mb-md">
                <q-card class="curso-card">
                  <q-img src="/api/placeholder/400/200">
                    <div
                      class="absolute-bottom text-subtitle1 text-center bg-secondary text-white q-pa-xs"
                    >
                      Idiomas
                    </div>
                  </q-img>
                  <q-card-section>
                    <div class="text-h6">Cursos de Idiomas</div>
                    <q-list dense>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="flag" color="secondary" />
                        </q-item-section>
                        <q-item-section>Inglês</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="flag" color="secondary" />
                        </q-item-section>
                        <q-item-section>Espanhol</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="flag" color="secondary" />
                        </q-item-section>
                        <q-item-section>Francês</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="flag" color="secondary" />
                        </q-item-section>
                        <q-item-section>Mandarim</q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat color="secondary" label="Ver Detalhes" />
                  </q-card-actions>
                </q-card>
              </div>

              <!-- Negócios -->
              <div class="col-12 col-md-4 q-mb-md">
                <q-card class="curso-card">
                  <q-img src="/api/placeholder/400/200">
                    <div
                      class="absolute-bottom text-subtitle1 text-center bg-primary text-white q-pa-xs"
                    >
                      Negócios
                    </div>
                  </q-img>
                  <q-card-section>
                    <div class="text-h6">Cursos de Negócios</div>
                    <q-list dense>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="business" color="primary" />
                        </q-item-section>
                        <q-item-section>Administração</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="trending_up" color="primary" />
                        </q-item-section>
                        <q-item-section>Marketing Digital</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="groups" color="primary" />
                        </q-item-section>
                        <q-item-section>Liderança</q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="calculate" color="primary" />
                        </q-item-section>
                        <q-item-section>Finanças</q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat color="primary" label="Ver Detalhes" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <div class="text-center q-pa-lg">
              <q-btn color="primary" label="Ver Todos os Cursos" size="lg" />
            </div>
          </q-tab-panel>

          <!-- PAINEL PROFESSORES -->
          <q-tab-panel name="professores">
            <div class="text-h4 text-primary q-mb-lg">Nossos Professores</div>

            <div class="row q-col-gutter-lg">
              <!-- Professor 1 -->
              <div class="col-12 col-sm-6 col-md-4 q-mb-md">
                <q-card>
                  <q-img src="/api/placeholder/300/300" />
                  <q-card-section>
                    <div class="text-h6">Dr. João Silva</div>
                    <div class="text-subtitle2 text-primary">Tecnologia</div>
                    <p class="q-mt-sm">
                      Doutor em Ciência da Computação com mais de 15 anos de
                      experiência em desenvolvimento de software e inteligência
                      artificial.
                    </p>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn flat round color="primary" icon="email" />
                    <q-btn flat round color="primary" icon="public" />
                    <q-space />
                    <q-btn flat color="primary" label="Ver Perfil" />
                  </q-card-actions>
                </q-card>
              </div>

              <!-- Professor 2 -->
              <div class="col-12 col-sm-6 col-md-4 q-mb-md">
                <q-card>
                  <q-img src="/api/placeholder/300/300" />
                  <q-card-section>
                    <div class="text-h6">Profa. Maria Oliveira</div>
                    <div class="text-subtitle2 text-secondary">Idiomas</div>
                    <p class="q-mt-sm">
                      Mestre em Linguística Aplicada com experiência
                      internacional. Especialista em metodologias inovadoras
                      para o ensino de idiomas.
                    </p>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn flat round color="secondary" icon="email" />
                    <q-btn flat round color="secondary" icon="public" />
                    <q-space />
                    <q-btn flat color="secondary" label="Ver Perfil" />
                  </q-card-actions>
                </q-card>
              </div>

              <!-- Professor 3 -->
              <div class="col-12 col-sm-6 col-md-4 q-mb-md">
                <q-card>
                  <q-img src="/api/placeholder/300/300" />
                  <q-card-section>
                    <div class="text-h6">Prof. Carlos Santos</div>
                    <div class="text-subtitle2 text-primary">Negócios</div>
                    <p class="q-mt-sm">
                      MBA em Administração de Empresas com vasta experiência
                      executiva em multinacionais. Especialista em estratégia
                      empresarial.
                    </p>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn flat round color="primary" icon="email" />
                    <q-btn flat round color="primary" icon="public" />
                    <q-space />
                    <q-btn flat color="primary" label="Ver Perfil" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <div class="text-center q-pa-lg">
              <q-btn
                color="primary"
                label="Ver Todos os Professores"
                size="lg"
              />
            </div>
          </q-tab-panel>

          <!-- PAINEL INSCRIÇÕES -->
          <q-tab-panel name="inscricoes">
            <div class="text-h4 text-primary q-mb-lg">Inscrições</div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-card class="q-pa-md">
                  <q-card-section>
                    <div class="text-h5 q-mb-md">Formulário de Inscrição</div>
                    <q-form @submit="onSubmit" class="q-gutter-md">
                      <q-input
                        filled
                        v-model="inscricao.nome"
                        label="Nome Completo *"
                        hint="Nome e sobrenome"
                        lazy-rules
                      />

                      <q-input
                        filled
                        v-model="inscricao.email"
                        label="Email *"
                        hint="exemplo@email.com"
                        type="email"
                        lazy-rules
                      />

                      <q-input
                        filled
                        v-model="inscricao.telefone"
                        label="Telefone *"
                        mask="(##) #####-####"
                        hint="(99) 99999-9999"
                        lazy-rules
                      />

                      <q-select
                        filled
                        v-model="inscricao.curso"
                        :options="opcoesCursos"
                        label="Curso de Interesse *"
                        lazy-rules
                      />

                      <q-select
                        filled
                        v-model="inscricao.horario"
                        :options="['Manhã', 'Tarde', 'Noite']"
                        label="Horário Preferido"
                        lazy-rules
                      />

                      <q-input
                        filled
                        v-model="inscricao.mensagem"
                        type="textarea"
                        label="Mensagem (opcional)"
                        hint="Dúvidas ou informações adicionais"
                      />

                      <q-toggle
                        v-model="inscricao.privacidade"
                        label="Concordo com a Política de Privacidade *"
                      />

                      <div>
                        <q-btn label="Enviar" type="submit" color="primary" />
                        <q-btn
                          label="Limpar"
                          type="reset"
                          color="secondary"
                          flat
                          class="q-ml-sm"
                        />
                      </div>
                    </q-form>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-12 col-md-6">
                <q-card class="q-pa-md">
                  <q-card-section>
                    <div class="text-h5 q-mb-md">
                      Informações para Inscrição
                    </div>

                    <div class="q-py-md">
                      <div class="text-subtitle1 text-weight-bold text-primary">
                        Processo de Matrícula
                      </div>
                      <p>
                        Após o preenchimento do formulário, nossa equipe entrará
                        em contato em até 48 horas para agendar uma entrevista e
                        fornecer mais informações sobre o processo de matrícula.
                      </p>
                    </div>

                    <div class="q-py-md">
                      <div class="text-subtitle1 text-weight-bold text-primary">
                        Documentos Necessários
                      </div>
                      <ul>
                        <li>Documento de identificação (RG/CPF)</li>
                        <li>Comprovante de residência</li>
                        <li>Histórico escolar</li>
                        <li>Foto 3x4 recente</li>
                      </ul>
                    </div>

                    <div class="q-py-md">
                      <div class="text-subtitle1 text-weight-bold text-primary">
                        Formas de Pagamento
                      </div>
                      <p>
                        Oferecemos diversas modalidades de pagamento, incluindo
                        boleto bancário, cartão de crédito em até 12x sem juros,
                        e planos especiais para pagamento à vista.
                      </p>
                    </div>

                    <div
                      class="q-py-md bg-grey-2 q-pa-md q-mt-lg rounded-borders"
                    >
                      <div class="text-subtitle1 text-weight-bold">
                        Precisa de ajuda?
                      </div>
                      <p>
                        Nossa equipe de atendimento está disponível para
                        esclarecer suas dúvidas.
                      </p>
                      <div class="row items-center q-mt-sm">
                        <q-icon
                          name="phone"
                          size="1.5rem"
                          color="primary"
                          class="q-mr-sm"
                        />
                        <span>+123 456 7890</span>
                      </div>
                      <div class="row items-center q-mt-sm">
                        <q-icon
                          name="email"
                          size="1.5rem"
                          color="primary"
                          class="q-mr-sm"
                        />
                        <span>inscricoes@escolax.com</span>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <!-- FOOTER -->
        <div class="bg-primary text-white">
          <q-toolbar>
            <div class="row full-width q-pa-md">
              <div class="col-12 col-md-4 q-pa-md">
                <div class="text-h6 q-mb-md">Contatos</div>
                <div class="q-mb-sm">
                  <q-icon name="phone" size="1rem" class="q-mr-sm" />
                  <span
                    >{{ institution?.mainContact }} /
                    {{ institution?.alternativeContact }} /
                    {{ institution?.fixed }}</span
                  >
                </div>
                <div class="q-mb-sm">
                  <q-icon name="email" size="1rem" class="q-mr-sm" />
                  <span>{{ institution?.email }}</span>
                </div>
                <div>
                  <q-icon name="access_time" size="1rem" class="q-mr-sm" />
                  <span>Seg-Sex: 08:00 - 18:00</span>
                </div>
              </div>
              <div class="col-12 col-md-4 q-pa-md">
                <div class="text-h6 q-mb-md">Localização</div>
                <div class="q-mb-sm">
                  <q-icon name="place" size="1rem" class="q-mr-sm" />
                  <span>{{ institution?.address }}</span>
                </div>
                <div>
                  <q-icon name="map" size="1rem" class="q-mr-sm" />
                  <span
                    >{{ institution?.neighborhood }},
                    {{ institution?.district?.name }}</span
                  >
                </div>
              </div>
              <div class="col-12 col-md-4 q-pa-md">
                <div class="text-h6 q-mb-md">Redes Sociais</div>
                <div class="row q-gutter-sm">
                  <q-btn round flat icon="fab fa-facebook" />
                  <q-btn round flat icon="fab fa-instagram" />
                  <q-btn round flat icon="fab fa-twitter" />
                  <q-btn round flat icon="fab fa-youtube" />
                  <q-btn round flat icon="fab fa-linkedin" />
                </div>
              </div>
            </div>
          </q-toolbar>
          <div class="text-center q-pa-sm bg-primary">
            © 2025 Escola X. Todos os direitos reservados.
          </div>
        </div>
      </q-page>
    </q-page-container>

    <!-- FOOTER -->
  </q-layout>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useSiteStores } from "../store";
import { onMounted, ref } from "vue";
const apiUrl = import.meta.env.VITE_API_URL;

/* setup store */
const siteStores = useSiteStores();
const route = useRoute();

/* setup data */
const schoolSlug = route.params.schoolSlug;
const institution = ref();
const mainCarroselImagens = ref([]);
const aboutUsCarroselImagens = ref([]);
const educationsLevels = ref([]);

const tab = ref("inicio");
const drawerOpen = ref(false);
const inscricao = {
  nome: "",
  email: "",
  telefone: "",
  curso: null,
  horario: null,
  mensagem: "",
  privacidade: false,
};
const opcoesCursos = [
  "Desenvolvimento Web",
  "Desenvolvimento Mobile",
  "Robótica",
  "Cibersegurança",
  "Inglês",
  "Espanhol",
  "Francês",
  "Mandarim",
  "Administração",
  "Marketing Digital",
  "Liderança",
  "Finanças",
];

const slide = ref("1");
const slide1 = ref("1");
const autoplay = ref(true);

onMounted(async () => {
  try {
    await siteStores.findDomain(schoolSlug);
    institution.value = siteStores.institution;
    mainCarroselImagens.value = siteStores.institution.mainCarroselImagens;
    aboutUsCarroselImagens.value =
      siteStores.institution.aboutUsCarroselImagens;
      educationsLevels.value = siteStores.institution.educationsLevels
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
});
</script>

<style scoped>
.logo {
  width: 120px;
}

.banner-content {
  position: absolute;
  bottom: 20%;
  left: 10%;
  color: white;
}

.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}

.full-height {
  height: 400px;
}

/* Para ocultar as abas em telas pequenas */
.lt-md {
  display: none;
}

/* Para exibir as abas apenas em telas maiores */
.gt-sm {
  display: flex;
}

/* Estilos responsivos usando Quasar */
@media (max-width: 600px) {
  .lt-md {
    display: flex;
  }
  .gt-sm {
    display: none;
  }
}
</style>
